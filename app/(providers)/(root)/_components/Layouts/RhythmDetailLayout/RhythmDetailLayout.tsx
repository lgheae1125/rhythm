import { deleteUserRhythm, getUserRhythms } from '@/api/supabaseGetCategories';
import { baseURL } from '@/config/config';
import { useAuthStore } from '@/zustand/authStore';
import useSpotifyStore from '@/zustand/spotifyStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';
import { MdMusicOff } from 'react-icons/md';

interface RhythmDetailLayout {
  userRhythms: Awaited<ReturnType<typeof getUserRhythms>> | undefined;
  rhythmCategory: string;
}

function RhythmDetailLayout({
  userRhythms,
  rhythmCategory,
}: RhythmDetailLayout) {
  const queryClient = useQueryClient();

  const play = useSpotifyStore((state) => state.play);

  const currentUser = useAuthStore((state) => state.currentUser);

  const { mutate: handleClickDeleteUserRhythm } = useMutation({
    mutationFn: async ({
      userId,
      rhythmId,
    }: {
      userId: string;
      rhythmId: number;
    }) => {
      await deleteUserRhythm(userId, rhythmId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userRhythms', { category: rhythmCategory }],
      });
    },
  });
  return userRhythms ? (
    <ul className="mt-[310px] bg-[#121212] flex flex-wrap gap-2 w-full pr-32">
      {userRhythms?.map((userRhythm) => (
        <li
          key={userRhythm?.id}
          className="flex flex-col gap-x-4 gap-y-2 w-[calc((100%-24px)/4)] p-5 duration-300 transition-all hover:bg-white/20"
        >
          <div className="relative h-full aspect-square rounded-md bg-white/20 overflow-hidden group">
            <div className="absolute w-full h-full p-2 bg-black/60 opacity-0 duration-300 transition-all group-hover:opacity-100">
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/profiles/${userRhythm?.userId}`}
                  className="w-10 h-10 bg-white/20 rounded-full overflow-hidden"
                >
                  <img
                    src={baseURL + userRhythm?.author?.imgUrl}
                    alt={userRhythm?.author?.userName}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <p className="text-white font-semibold line-clamp-1">
                  {userRhythm?.userName}
                </p>

                {currentUser?.id === userRhythm?.userId ? (
                  <button
                    onClick={() =>
                      handleClickDeleteUserRhythm({
                        userId: String(userRhythm?.userId),
                        rhythmId: Number(userRhythm?.id),
                      })
                    }
                    className="absolute bottom-0 right-0 p-2 text-[12px] font-semibold text-white/25 duration-200 hover:text-red-500"
                  >
                    remove
                  </button>
                ) : null}
                {/* 버튼 누르면 바로 재생 */}
                <button
                  onClick={() =>
                    play({ context: [userRhythm.trackUri], index: 0 })
                  }
                  aria-label="재생 버튼"
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-red-500 text-xs transition-all duration-300 group-hover:text-xl"
                >
                  <FaPlay />
                </button>
              </div>
            </div>
            {userRhythm?.trackImgURL ? (
              <img
                src={userRhythm?.trackImgURL}
                alt={userRhythm?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex justify-center items-center">
                <MdMusicOff className="w-10 h-10 text-white/70" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-1">
            <Link href={`/userRhythm/${rhythmCategory}/${userRhythm.id}`}>
              <p className="font-bold text-white/80 line-clamp-1">
                {userRhythm?.title}
              </p>
            </Link>
            <p className="text-white/40 text-sm line-clamp-1">
              {userRhythm?.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  ) : null;
}

export default RhythmDetailLayout;

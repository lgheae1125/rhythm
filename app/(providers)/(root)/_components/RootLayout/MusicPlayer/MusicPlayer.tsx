'use client';

import LikeButton from '@/components/LikeButton';
import { useAuthStore } from '@/zustand/authStore';
import useSpotifyStore from '@/zustand/spotifyStore';
import { FaPause, FaPlay } from 'react-icons/fa';
import { IoMdSkipBackward, IoMdSkipForward } from 'react-icons/io';
import { PiHeartStraightDuotone } from 'react-icons/pi';
import { toast } from 'react-toastify';
import LyricsButton from './LyricsButton/LyricsButton';
import OptionButton from './OptionButton/OptionButton';
import PlaybackBar from './PlaybackBar/PlaybackBar';
import RecentPlaylistButton from './RecentPlaylistButton/RecentPlaylistButton';
import RepeatMusicButton from './RepeatMusicButton/RepeatMusicButton';
import VolumeBar from './VolumeBar';

function MusicPlayer() {
  // spotify store
  const currentTrack = useSpotifyStore((state) => state.currentTrack);
  const isPaused = useSpotifyStore((state) => state.isPaused);
  const pause = useSpotifyStore((state) => state.pause);
  const pauseAndResumeTrack = useSpotifyStore(
    (state) => state.pauseAndResumeTrack,
  );
  const playPrevTrack = useSpotifyStore((state) => state.playPrevTrack);
  const playNextTrack = useSpotifyStore((state) => state.playNextTrack);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const trackId = currentTrack?.id;

  const handleClickPlayButton = () => {
    if (!isLoggedIn) return toast.error('로그인 하세요');

    if (!currentTrack) return toast.error('현재 재생중인 곡이 없습니다');

    pauseAndResumeTrack([currentTrack!.uri]);
  };

  return (
    <div className="fixed bottom-0 w-full bg-rhythmBlack flex flex-col max-h-[160px] z-30">
      <div className=" grid grid-cols-7 items-center pt-4 pb-2 px-8">
        <div className="flex col-span-7 w-full">
          <PlaybackBar />
        </div>
        <div
          id="music-player-left"
          className="col-span-2 grid grid-cols-5 gap-x-2 items-center"
        >
          {currentTrack ? (
            <div className="bg-gray-400 w-full aspect-square col-span-1">
              <img
                className="w-full h-full object-cover"
                src={currentTrack.album.images[1].url}
                alt={currentTrack.album.name}
              />
            </div>
          ) : (
            <div className="bg-gray-400 w-full aspect-square col-span-1"></div>
          )}
          {/* 노래 썸네일? url 넣어주면 됨 */}

          <div className="flex flex-col col-span-2">
            <p className="text-white font-bold text-lg line-clamp-1">
              {currentTrack ? currentTrack.name : '오늘 뭐 듣지?'}
            </p>
            <p className="text-gray-400 line-clamp-1">
              {currentTrack
                ? currentTrack.artists.map((artist) => artist.name).join(', ')
                : '노래를 재생해보세요.'}
            </p>
          </div>
          <div className="flex items-center gap-x-2 col-span-2">
            <button
              aria-label="좋아요 버튼"
              className="text-gray-400 py-2 text-4xl transition-all duration-75 hover:text-white"
            >
              {!trackId ? (
                <PiHeartStraightDuotone />
              ) : (
                <LikeButton hasBorder={false} trackId={trackId} />
              )}
            </button>
            {/* 가사 보기 버튼 */}
            <LyricsButton />
            {/* 옵션 버튼 */}
            <OptionButton location={'player'} />
          </div>
        </div>
        <div
          id="music-player-middle"
          className="mx-20 col-span-3 flex flex-wrap gap-x-6 justify-center items-center"
        >
          {/* 이전 곡 버튼 */}
          <button
            aria-label="이전 곡 버튼"
            onClick={playPrevTrack}
            className="text-3xl text-gray-400 p-2 transition-all duration-75 hover:text-white hover:scale-110"
          >
            <IoMdSkipBackward />
          </button>

          <div className="rounded-full transition-all duration-300 hover:bg-white hover:bg-opacity-30">
            {/* play 버튼 */}
            {isPaused === true || isPaused === null ? (
              <button
                aria-label="플레이 버튼"
                className="text-4xl py-4 pl-5 pr-3 text-red-500"
                onClick={handleClickPlayButton}
              >
                <FaPlay />
              </button>
            ) : (
              <button
                aria-label="멈춤 버튼"
                className="text-4xl py-4 pl-4 pr-4 text-red-500"
                onClick={() => pause()}
              >
                <FaPause />
              </button>
            )}
          </div>

          {/* 다음 곡 버튼 */}
          <button
            aria-label="다음 곡 버튼"
            className="text-3xl text-gray-400 p-2 transition-all duration-75 hover:text-white hover:scale-110"
            onClick={playNextTrack}
          >
            <IoMdSkipForward />
          </button>
        </div>

        <div className="col-span-2 flex items-center ml-auto">
          <VolumeBar />
          {/* 현재 재생한 곡들의 목록 */}
          <div className="flex">
            <RepeatMusicButton />
            <RecentPlaylistButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;

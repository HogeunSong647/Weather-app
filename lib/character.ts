import { DailyWeather } from '@/types/weather';

interface CharacterReaction {
  emoji: string;
  message: string;
  outfit: string; // 옷차림 추천 (보너스!)
}

export function getCharacterReaction(weather: DailyWeather): CharacterReaction {
  const { tempMax, tempMin, willRain, description } = weather;
  const avgTemp = (tempMax + tempMin) / 2;

  // 비/눈 우선 판단
  if (willRain) {
    if (description === '눈') {
      return {
        emoji: '⛄',
        message: '와! 눈이 와요! 따뜻하게 입고 나가세요',
        outfit: '🧥 두꺼운 코트 + 🧤 장갑 + 🧣 목도리',
      };
    }
    return {
      emoji: '☔',
      message: '비가 와요... 우산 꼭 챙기세요!',
      outfit: '🧥 방수 자켓 + 👟 미끄럼 방지 신발',
    };
  }

  // 기온별 반응
  if (avgTemp >= 28) {
    return {
      emoji: '🥵',
      message: '너무 더워요! 시원하게 입으세요',
      outfit: '👕 반팔 + 🩳 반바지 + 🕶️ 선글라스',
    };
  }
  if (avgTemp >= 23) {
    return {
      emoji: '😎',
      message: '딱 좋은 날씨네요! 산책하기 완벽해요',
      outfit: '👕 얇은 셔츠 + 👖 면바지',
    };
  }
  if (avgTemp >= 17) {
    return {
      emoji: '😊',
      message: '선선한 날씨, 가벼운 외출 추천!',
      outfit: '👔 긴팔 + 🧥 가벼운 가디건',
    };
  }
  if (avgTemp >= 10) {
    return {
      emoji: '🍂',
      message: '쌀쌀해요. 자켓 챙기세요',
      outfit: '🧥 자켓 + 👖 청바지',
    };
  }
  if (avgTemp >= 0) {
    return {
      emoji: '🥶',
      message: '추워요! 따뜻하게 입어주세요',
      outfit: '🧥 코트 + 🧣 목도리',
    };
  }
  return {
    emoji: '🧊',
    message: '엄청 추워요! 단단히 무장하세요',
    outfit: '🧥 패딩 + 🧣 목도리 + 🧤 장갑 + 🥾 부츠',
  };
}

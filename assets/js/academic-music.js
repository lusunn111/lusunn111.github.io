(() => {
  const dataElement = document.querySelector("#academic-music-data");
  const audio = document.querySelector("#academic-music-audio");
  const player = document.querySelector(".academic-music-player");

  if (!dataElement || !audio || !player) return;

  let tracks;
  try {
    tracks = JSON.parse(dataElement.textContent);
  } catch (_error) {
    return;
  }

  const playable = tracks.map((track, index) => (track.preview_url ? index : -1)).filter((index) => index >= 0);
  if (playable.length === 0) return;

  const playButton = player.querySelector('[data-music-action="play"]');
  const previousButton = player.querySelector('[data-music-action="previous"]');
  const nextButton = player.querySelector('[data-music-action="next"]');
  const modeButton = player.querySelector('[data-music-action="mode"]');
  const muteButton = player.querySelector('[data-music-action="mute"]');
  const progress = player.querySelector("[data-music-progress]");
  const volume = player.querySelector("[data-music-volume]");
  const volumeValue = player.querySelector("[data-music-volume-value]");
  const currentTime = player.querySelector('[data-music-time="current"]');
  const duration = player.querySelector('[data-music-time="duration"]');
  const title = player.querySelector(".academic-music-player-title");
  const artist = player.querySelector(".academic-music-player-artist");
  const queueButtons = [...document.querySelectorAll("[data-music-play]")];

  let currentIndex = playable[0];
  let mode = 0;
  let shuffleOrder = [];
  let shufflePosition = 0;
  let previousVolume = 20;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  };

  const setRangeFill = (input, value) => {
    input.value = value;
    input.style.setProperty("--progress", `${value}%`);
  };

  const updatePlayingState = () => {
    const playing = !audio.paused;
    playButton.querySelector("i").className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
    playButton.setAttribute("aria-label", playing ? "Pause preview" : "Play preview");

    document.querySelectorAll("[data-music-track]").forEach((card) => {
      card.classList.toggle("is-playing", playing && Number(card.dataset.musicTrack) === currentIndex);
    });

    queueButtons.forEach((button) => {
      const active = Number(button.dataset.musicPlay) === currentIndex;
      button.classList.toggle("is-active", active);
      button.innerHTML =
        active && playing
          ? '[<i class="fa-solid fa-pause" aria-hidden="true"></i> Pause]'
          : '[<i class="fa-solid fa-headphones" aria-hidden="true"></i> Play]';
      button.setAttribute("aria-label", `${active && playing ? "Pause" : "Play"} preview of ${tracks[Number(button.dataset.musicPlay)].title}`);
    });
  };

  const buildShuffleOrder = (startIndex) => {
    shuffleOrder = playable.filter((index) => index !== startIndex);
    for (let index = shuffleOrder.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [shuffleOrder[index], shuffleOrder[target]] = [shuffleOrder[target], shuffleOrder[index]];
    }
    shuffleOrder.unshift(startIndex);
    shufflePosition = 0;
  };

  const loadTrack = (index, autoplay = false) => {
    const track = tracks[index];
    if (!track?.preview_url) return;

    currentIndex = index;
    audio.src = track.preview_url;
    audio.load();
    title.textContent = track.title;
    artist.textContent = track.artist;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setRangeFill(progress, 0);
    updatePlayingState();

    if (autoplay) audio.play().catch(() => updatePlayingState());
  };

  const adjacentTrack = (direction) => {
    if (mode === 1) {
      if (shuffleOrder.length !== playable.length) buildShuffleOrder(currentIndex);
      shufflePosition = (shufflePosition + direction + shuffleOrder.length) % shuffleOrder.length;
      return shuffleOrder[shufflePosition];
    }

    const position = playable.indexOf(currentIndex);
    return playable[(position + direction + playable.length) % playable.length];
  };

  const playAdjacent = (direction) => loadTrack(adjacentTrack(direction), true);

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => updatePlayingState());
    } else {
      audio.pause();
    }
  });

  previousButton.addEventListener("click", () => playAdjacent(-1));
  nextButton.addEventListener("click", () => playAdjacent(1));

  modeButton.addEventListener("click", () => {
    mode = (mode + 1) % 3;
    const icon = modeButton.querySelector("i");
    const labels = ["sequential", "shuffle", "repeat one"];
    icon.className = ["fa-solid fa-repeat", "fa-solid fa-shuffle", "fa-solid fa-arrow-rotate-right"][mode];
    modeButton.setAttribute("aria-label", `Playback mode: ${labels[mode]}`);
    modeButton.setAttribute("title", `Playback mode: ${labels[mode]}`);
    if (mode === 1) buildShuffleOrder(currentIndex);
  });

  queueButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.musicPlay);
      if (index === currentIndex && !audio.paused) {
        audio.pause();
      } else if (index === currentIndex) {
        audio.play().catch(() => updatePlayingState());
      } else {
        loadTrack(index, true);
      }
    });
  });

  progress.addEventListener("input", () => {
    setRangeFill(progress, progress.value);
    if (Number.isFinite(audio.duration)) {
      const target = (Number(progress.value) / 100) * audio.duration;
      currentTime.textContent = formatTime(target);
    }
  });

  progress.addEventListener("change", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  const updateVolume = () => {
    const value = Number(volume.value);
    if (value > 0) previousVolume = value;
    audio.volume = value / 100;
    volumeValue.textContent = `${value}%`;
    setRangeFill(volume, value);
    const icon = muteButton.querySelector("i");
    icon.className = value === 0 ? "fa-solid fa-volume-xmark" : value < 50 ? "fa-solid fa-volume-low" : "fa-solid fa-volume-high";
    muteButton.setAttribute("aria-label", value === 0 ? "Unmute preview" : "Mute preview");
  };

  volume.addEventListener("input", updateVolume);
  muteButton.addEventListener("click", () => {
    volume.value = Number(volume.value) === 0 ? previousVolume : 0;
    updateVolume();
  });

  audio.addEventListener("play", updatePlayingState);
  audio.addEventListener("pause", updatePlayingState);
  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
    currentTime.textContent = formatTime(audio.currentTime);
    setRangeFill(progress, (audio.currentTime / audio.duration) * 100);
  });
  audio.addEventListener("ended", () => {
    if (mode === 2) {
      audio.currentTime = 0;
      audio.play().catch(() => updatePlayingState());
    } else {
      playAdjacent(1);
    }
  });

  loadTrack(currentIndex, false);
  updateVolume();
})();

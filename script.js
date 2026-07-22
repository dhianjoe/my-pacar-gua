/**
 * ============================================================================
 * WEBSITE ROMANTIS & PERMINTAAN MAAF
 * Script Utama: Mengatur Seluruh Interaksi, Canvas Partikel, Galeri, & Musik
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ARRAY DATA FOTO & CAPTION
     ========================================================================== */
  // Daftar nama file foto (Bisa Anda ganti atau letakkan file foto di folder yang sama)
  const photos = [
    "foto1.jpg",
    "foto2.jpg",
    "foto3.jpg",
    "foto4.jpg",
    "foto5.jpg",
    "foto6.jpg"
  ];

  // Caption sesuai dengan urutan foto 1 sampai 6 (Persis seperti yang Anda minta)
  const captions = [
    "Senyum kecilmu selalu berhasil bikin hariku lebih indah.",
    "Bahkan saat kamu cuma diam, kamu tetap cantik.",
    "Tatapanmu selalu berhasil bikin aku salah tingkah.",
    "Kamu cantik tanpa harus menjadi orang lain.",
    "Mau pakai filter ataupun tidak, tetap kamu yang paling aku suka.",
    "Dan inilah alasan kenapa sampai sekarang aku masih jatuh cinta sama perempuan yang sama."
  ];

  // Teks Surat Permintaan Maaf untuk Efek Mengetik
  const apologyText = `Sayang...

Sekarang aku ingin jujur.

Aku tahu akhir-akhir ini aku banyak membuat kamu kecewa.

Aku sering ingkar sama janji yang aku buat sendiri.

Aku juga kurang meluangkan waktu buat kamu, padahal kamu selalu berusaha ada untukku.

Dan aku sadar...

Aku juga masih sering memberikan like pada video perempuan lain.

Mungkin buatku itu terlihat sepele.

Tapi sekarang aku benar-benar mengerti kalau itu membuat kamu sakit hati dan merasa tidak dihargai.

Aku benar-benar minta maaf.

Aku tidak ingin mencari alasan ataupun pembenaran.

Aku hanya ingin mengakui kalau aku memang salah.

Aku sadar kepercayaan tidak dibangun dari kata-kata, tetapi dari tindakan.

Karena itu aku ingin membuktikan kalau aku bisa berubah.

Aku akan belajar menepati janji.

Aku akan lebih banyak meluangkan waktu buat kamu.

Aku akan lebih menjaga sikapku supaya kamu tidak perlu merasa khawatir lagi.

Aku ingin menjadi tempat yang membuatmu merasa tenang, bukan justru membuatmu terluka.

Terima kasih karena selama ini masih bertahan bersamaku.

Aku tahu meminta maaf saja mungkin belum cukup.

Tapi aku berharap kamu masih mau memberiku kesempatan untuk memperbaiki semuanya.

Karena bagiku...

Kamu bukan hanya perempuan paling cantik.

Kamu juga rumah yang selalu ingin aku pulang.

Aku sayang banget sama kamu. ❤️`;

  /* ==========================================================================
     2. ELEMENT DOM SELECTORS
     ========================================================================== */
  const bgLayer = document.getElementById('bgLayer');
  
  // Section Selectors
  const envelopeSection = document.getElementById('envelopeSection');
  const letterSection = document.getElementById('letterSection');
  const gallerySection = document.getElementById('gallerySection');
  const apologySection = document.getElementById('apologySection');
  const reconciliationSection = document.getElementById('reconciliationSection');

  // Element Interactive
  const envelope = document.getElementById('envelope');
  const btnSeeBeauty = document.getElementById('btnSeeBeauty');
  const polaroidCard = document.getElementById('polaroidCard');
  const polaroidImage = document.getElementById('polaroidImage');
  const polaroidPlaceholder = document.getElementById('polaroidPlaceholder');
  const placeholderFilename = document.getElementById('placeholderFilename');
  const polaroidText = document.getElementById('polaroidText');
  const photoCounter = document.getElementById('photoCounter');
  const btnNextPhoto = document.getElementById('btnNextPhoto');

  // Element Apology & Typing
  const typingOutput = document.getElementById('typingOutput');
  const typingCursor = document.getElementById('typingCursor');
  const questionContainer = document.getElementById('questionContainer');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const reassuranceMessage = document.getElementById('reassuranceMessage');

  // Modal Peluk Virtual
  const btnVirtualHug = document.getElementById('btnVirtualHug');
  const hugModal = document.getElementById('hugModal');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // Music Player Selectors
  const musicController = document.getElementById('musicController');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');
  const romanticAudio = document.getElementById('romanticAudio');

  // State Variables
  let currentPhotoIndex = 0;
  let noButtonDodgeCount = 0;
  let isPlayingMusic = false;

  /* Reset Keadaan Awal (Kembali ke Halaman Pertama: Amplop) */
  function resetInitialState() {
    // Sembunyikan semua section kecuali Amplop
    envelopeSection.classList.remove('hidden');
    envelopeSection.classList.add('active');
    
    letterSection.classList.add('hidden');
    letterSection.classList.remove('active');

    gallerySection.classList.add('hidden');
    gallerySection.classList.remove('active');

    apologySection.classList.add('hidden');
    apologySection.classList.remove('active');

    reconciliationSection.classList.add('hidden');
    reconciliationSection.classList.remove('active');

    // Sembunyikan Modal Peluk Virtual
    hugModal.classList.add('hidden');

    // Reset Amplop & Teks Typing
    envelope.classList.remove('open');
    typingOutput.textContent = '';
    typingCursor.style.display = 'inline';
    questionContainer.classList.add('hidden');
    reassuranceMessage.classList.add('hidden');
    
    // Reset Background ke Pink Pastel
    bgLayer.className = 'bg-layer';
  }

  // Panggil reset di awal
  resetInitialState();

  /* ==========================================================================
     3. AUDIO SYSTEM & SYNTHESIZER FALLBACK
     ========================================================================== */
  // Tone Synthesizer sederhana berbasis Web Audio API jika file mp3 lokal/external gagal
  let audioCtx = null;
  let synthInterval = null;

  function playAmbientPianoSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Frekuensi Melodi Romantis (Skala Mayor)
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 329.63, 293.66];
    let noteIdx = 0;

    synthInterval = setInterval(() => {
      if (!isPlayingMusic) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.8);
        noteIdx = (noteIdx + 1) % notes.length;
      } catch (e) {
        console.log("Audio Synth Error", e);
      }
    }, 800);
  }

  function toggleMusic(forcePlay = false) {
    if (forcePlay) isPlayingMusic = false;

    if (!isPlayingMusic) {
      // Coba putar file HTML5 Audio
      romanticAudio.play().then(() => {
        isPlayingMusic = true;
        updateMusicUI(true);
      }).catch(err => {
        // Jika file audio terblokir atau 404, gunakan synth ambient
        console.warn("Using Web Audio Synth Fallback for Romantic Tone");
        isPlayingMusic = true;
        updateMusicUI(true);
        playAmbientPianoSynth();
      });
    } else {
      romanticAudio.pause();
      if (synthInterval) clearInterval(synthInterval);
      isPlayingMusic = false;
      updateMusicUI(false);
    }
  }

  function updateMusicUI(playing) {
    if (playing) {
      musicController.classList.add('playing');
      musicIcon.textContent = '🎶';
      musicText.textContent = 'Pause Music';
    } else {
      musicController.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicText.textContent = 'Play Music';
    }
  }

  musicToggleBtn.addEventListener('click', () => toggleMusic());

  /* ==========================================================================
     4. CANVAS PARTICLE ENGINE (Hearts, Sakura, Stars, Confetti)
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let currentParticleMode = 'default'; // 'default', 'stars', 'love'

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(type) {
      this.reset(type);
    }

    reset(type) {
      this.type = type || (Math.random() > 0.4 ? 'heart' : 'sakura');
      this.x = Math.random() * canvas.width;
      this.y = this.type === 'star' ? Math.random() * canvas.height : -20;
      this.size = Math.random() * (this.type === 'heart' ? 14 : 10) + 8;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.speedX = Math.sin(Math.random() * Math.PI) * 1;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.color = this.getRandomColor();
    }

    getRandomColor() {
      if (this.type === 'heart') {
        const colors = ['#FF6B95', '#FF8EA7', '#FFB6C1', '#E84A75'];
        return colors[Math.floor(Math.random() * colors.length)];
      } else if (this.type === 'sakura') {
        const colors = ['#FFDBE9', '#FFE4E1', '#FFF0F5', '#FFC0CB'];
        return colors[Math.floor(Math.random() * colors.length)];
      } else if (this.type === 'star') {
        return '#FFD700';
      } else if (this.type === 'confetti') {
        const colors = ['#FF6B95', '#FFD700', '#4ECDC4', '#1A535C', '#FF9F1C', '#FFFFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      return '#FF6B95';
    }

    update() {
      if (this.type === 'star') {
        this.opacity += Math.sin(Date.now() * 0.003 + this.x) * 0.01;
        if (this.opacity < 0.2) this.opacity = 0.2;
        if (this.opacity > 1) this.opacity = 1;
        return;
      }

      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.02) + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 20) {
        this.reset(this.type);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
      } else if (this.type === 'sakura') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size / 2, this.size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'star') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFD700';
      } else if (this.type === 'confetti') {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
      }

      ctx.restore();
    }
  }

  function initParticles(count = 40, mode = 'default') {
    particles = [];
    currentParticleMode = mode;
    for (let i = 0; i < count; i++) {
      if (mode === 'stars') {
        particles.push(new Particle('star'));
      } else if (mode === 'love') {
        particles.push(new Particle(Math.random() > 0.3 ? 'heart' : 'confetti'));
      } else {
        particles.push(new Particle());
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles(45, 'default');
  animateParticles();

  function triggerConfettiBurst() {
    for (let i = 0; i < 50; i++) {
      const p = new Particle('confetti');
      p.x = canvas.width / 2;
      p.y = canvas.height / 2;
      p.speedY = (Math.random() - 0.5) * 8;
      p.speedX = (Math.random() - 0.5) * 8;
      particles.push(p);
    }
  }

  /* ==========================================================================
     5. SEKSI 1: INTERAKSI AMPLOP VINTAGE
     ========================================================================== */
  envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    
    // Trik audio ringan saat membuka
    try {
      const audioOpen = new Audio();
      audioOpen.volume = 0.3;
    } catch(e){}

    setTimeout(() => {
      transitionSection(envelopeSection, letterSection);
    }, 900);
  });

  /* ==========================================================================
     6. SEKSI 2: SURAT CINTA -> GALERI FOTO
     ========================================================================== */
  btnSeeBeauty.addEventListener('click', () => {
    transitionSection(letterSection, gallerySection);
    loadPhoto(0);
  });

  /* ==========================================================================
     7. SEKSI 3: POLAROID PHOTO GALLERY
     ========================================================================== */
  function loadPhoto(index) {
    if (index >= photos.length) {
      // Pindah ke Seksi Apology (Starry Night)
      startApologySection();
      return;
    }

    currentPhotoIndex = index;
    photoCounter.textContent = `Foto ${index + 1} dari ${photos.length}`;
    
    // Animasi Zoom & Fade saat ganti foto
    polaroidCard.classList.add('zoom-fade');

    setTimeout(() => {
      const filename = photos[index];
      placeholderFilename.textContent = filename;
      polaroidImage.src = filename;
      polaroidText.textContent = captions[index] || "";

      // Event check apakah gambar berhasil di-load
      polaroidImage.onload = () => {
        polaroidImage.style.display = 'block';
        polaroidPlaceholder.classList.add('hidden');
      };
      polaroidImage.onerror = () => {
        polaroidImage.style.display = 'none';
        polaroidPlaceholder.classList.remove('hidden');
      };

      polaroidCard.classList.remove('zoom-fade');
    }, 300);
  }

  function nextPhoto() {
    loadPhoto(currentPhotoIndex + 1);
  }

  polaroidCard.addEventListener('click', nextPhoto);
  btnNextPhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    nextPhoto();
  });

  /* ==========================================================================
     8. SEKSI 4: STARRY NIGHT & TYPING ANIMATION
     ========================================================================== */
  function startApologySection() {
    transitionSection(gallerySection, apologySection);
    bgLayer.classList.add('starry-night');
    initParticles(70, 'stars');

    // Mulai efek mengetik
    typeWriter(apologyText, 0);
  }

  function typeWriter(text, index) {
    if (index < text.length) {
      typingOutput.textContent += text.charAt(index);
      
      // Auto Scroll jika teks panjang
      const apologyCard = apologySection.querySelector('.apology-card');
      if (apologyCard) apologyCard.scrollTop = apologyCard.scrollHeight;

      // Kecepatan mengetik bervariasi untuk kesan alami
      let delay = 35;
      if (text.charAt(index) === '.' || text.charAt(index) === '\n') {
        delay = 250;
      }
      
      setTimeout(() => {
        typeWriter(text, index + 1);
      }, delay);
    } else {
      // Mengetik Selesai
      typingCursor.style.display = 'none';
      setTimeout(() => {
        questionContainer.classList.remove('hidden');
      }, 500);
    }
  }

  /* ==========================================================================
     9. LOGIKA TOMBOL "TIDAK" (EVASIVE BUTTON - TOUCH & MOBILE OPTIMIZED)
     ========================================================================== */
  function moveNoButton(e) {
    if (e && e.preventDefault) e.preventDefault();
    noButtonDodgeCount++;

    const isMobile = window.innerWidth <= 600;
    const maxDeltaX = isMobile ? Math.min(window.innerWidth * 0.35, 110) : 140;
    const maxDeltaY = isMobile ? 50 : 60;

    const randomX = (Math.random() - 0.5) * maxDeltaX * 2;
    const randomY = (Math.random() - 0.5) * maxDeltaY * 2;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.88)`;
    btnNo.style.opacity = '0.7';

    setTimeout(() => {
      btnNo.style.opacity = '1';
    }, 150);

    // Setelah 4x-5x menghindar, tampilkan pesan manis
    if (noButtonDodgeCount >= 4) {
      reassuranceMessage.classList.remove('hidden');
    }
  }

  // Interaksi mouse & touch pada tombol Tidak
  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', moveNoButton, { passive: false });
  btnNo.addEventListener('click', moveNoButton);

  /* ==========================================================================
     10. SEKSI 5: RECONCILIATION ("IYA" DIKLIK)
     ========================================================================== */
  btnYes.addEventListener('click', () => {
    // Ubah Latar Belakang ke Penuh Hati Pink
    bgLayer.className = 'bg-layer love-hearts';
    initParticles(60, 'love');
    triggerConfettiBurst();

    // Putar Musik Otomatis jika belum menyala
    if (!isPlayingMusic) {
      toggleMusic(true);
    }

    transitionSection(apologySection, reconciliationSection);
  });

  /* ==========================================================================
     11. MODAL PELUK VIRTUAL & SELEBRASI
     ========================================================================== */
  btnVirtualHug.addEventListener('click', () => {
    hugModal.classList.remove('hidden');
    triggerConfettiBurst();
    
    // Burst Tambahan Partikel Hati
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle('heart'));
    }
  });

  btnCloseModal.addEventListener('click', () => {
    hugModal.classList.add('hidden');
  });

  hugModal.addEventListener('click', (e) => {
    if (e.target === hugModal) {
      hugModal.classList.add('hidden');
    }
  });

  /* ==========================================================================
     12. HELPER UTILITY TRANSISI SECTION
     ========================================================================== */
  function transitionSection(fromSection, toSection) {
    fromSection.classList.remove('active');
    setTimeout(() => {
      fromSection.classList.add('hidden');
      toSection.classList.remove('hidden');
      setTimeout(() => {
        toSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 500);
  }

});

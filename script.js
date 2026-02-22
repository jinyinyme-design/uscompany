(function () {
  'use strict';

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-label', nav.classList.contains('is-open') ? '메뉴 닫기' : '메뉴 열기');
    });

    document.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
      });
    });
  }

  // Contact form: 견적 요청 시 문자/카톡/이메일로 보내기
  var form = document.getElementById('contactForm');
  var modal = document.getElementById('quoteModal');
  var modalOverlay = document.getElementById('quoteModalOverlay');
  var modalClose = document.getElementById('quoteModalClose');

  var equipmentLabels = {
    bench: '벤치',
    machine: '머신류',
    reformer: '리포머/필라테스',
    other: '기타'
  };

  function buildQuoteMessage() {
    var name = (form.querySelector('#name') && form.querySelector('#name').value) || '';
    var phone = (form.querySelector('#phone') && form.querySelector('#phone').value) || '';
    var gym = (form.querySelector('#gym') && form.querySelector('#gym').value) || '';
    var location = (form.querySelector('#location') && form.querySelector('#location').value) || '';
    var equipmentEl = form.querySelector('#equipment');
    var equipment = equipmentEl ? equipmentLabels[equipmentEl.value] || equipmentEl.value || '' : '';
    var photo = form.querySelector('#photo');
    var photoName = (photo && photo.files && photo.files[0]) ? photo.files[0].name : '';

    var lines = [
      '[USCOMPANY 무료 견적 문의]',
      '',
      '이름: ' + name,
      '연락처: ' + phone,
      '시설명: ' + gym,
      '위치: ' + location,
      '기구 종류: ' + equipment,
      '기구 사진: ' + (photoName || '첨부 없음')
    ];
    return lines.join('\n');
  }

  function openModal() {
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      openModal();
    });
  }

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  document.querySelectorAll('.quote-send-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var method = this.getAttribute('data-method');
      var email = form && form.getAttribute('data-email') ? form.getAttribute('data-email') : 'cijung2020@gmail.com';
      var phone = form && form.getAttribute('data-phone') ? form.getAttribute('data-phone').replace(/\D/g, '') : '01076381980';
      var kakaoUrl = form && form.getAttribute('data-kakao-url');
      var message = buildQuoteMessage();
      var encoded = encodeURIComponent(message);

      if (method === 'email') {
        var mailto = 'mailto:' + email + '?subject=' + encodeURIComponent('[USCOMPANY] 무료 견적 문의') + '&body=' + encoded;
        window.location.href = mailto;
      } else if (method === 'sms') {
        var smsLink = 'sms:' + phone + '?body=' + encoded;
        window.location.href = smsLink;
      } else if (method === 'kakao') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(message).then(function () {
            if (kakaoUrl && kakaoUrl.trim() !== '') {
              window.open(kakaoUrl, '_blank');
            }
            alert('견적 내용이 복사되었습니다. 카카오톡에서 붙여넣기(Ctrl+V) 후 전송해 주세요.');
          }).catch(function () {
            fallbackCopy(message);
          });
        } else {
          fallbackCopy(message);
        }
      }
      closeModal();
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      alert('견적 내용이 복사되었습니다. 카카오톡에서 붙여넣기 후 전송해 주세요.');
    } catch (err) {
      alert('아래 내용을 복사해 카카오톡으로 보내 주세요.\n\n' + text);
    }
    document.body.removeChild(ta);
  }
})();

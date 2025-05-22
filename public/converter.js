const inputField = document.getElementById('input-temp');
const fromUnitField = document.getElementById('input-unit');
const toUnitField = document.getElementById('output-unit');
const outputField = document.getElementById('output-temp');
const form = document.getElementById('converter');
const preview = document.getElementById('preview');
const cameraInput = document.getElementById('cameraInput');
const galleryInput = document.getElementById('galleryInput');
const galleryBtn = document.getElementById('openGalleryBtn');
const clearImageBtn = document.getElementById('clearImageBtn');
const refreshBtn = document.getElementById('refreshBtn');

function convertTemp(value, fromUnit, toUnit) {
  if (fromUnit === 'c') {
    if (toUnit === 'f') return value * 9 / 5 + 32;
    if (toUnit === 'k') return value + 273.15;
    return value;
  }
  if (fromUnit === 'f') {
    if (toUnit === 'c') return (value - 32) * 5 / 9;
    if (toUnit === 'k') return (value + 459.67) * 5 / 9;
    return value;
  }
  if (fromUnit === 'k') {
    if (toUnit === 'c') return value - 273.15;
    if (toUnit === 'f') return value * 9 / 5 - 459.67;
    return value;
  }
  throw new Error('Invalid unit');
}

form.addEventListener('input', () => {
  const inputTemp = parseFloat(inputField.value);
  const fromUnit = fromUnitField.value;
  const toUnit = toUnitField.value;

  if (isNaN(inputTemp)) {
    outputField.textContent = 'Invalid input';
    return;
  }

  const outputTemp = convertTemp(inputTemp, fromUnit, toUnit);
  outputField.textContent = (Math.round(outputTemp * 100) / 100) + ' ' + toUnit.toUpperCase();
});

cameraInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const photoURL = URL.createObjectURL(file);
    preview.src = photoURL;
    preview.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem('savedPhoto', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('savedPhoto');
  if (saved) {
    preview.src = saved;
    preview.style.display = 'block';
  }
});

galleryBtn.addEventListener('click', () => {
  galleryInput.click();
});

galleryInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const imgURL = URL.createObjectURL(file);
    preview.src = imgURL;
    preview.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem('savedPhoto', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

clearImageBtn.addEventListener('click', () => {
  preview.src = '';
  preview.style.display = 'none';
  localStorage.removeItem('savedPhoto');
});

refreshBtn.addEventListener('click', () => {
  const url = new URL(window.location.href);
  url.searchParams.set('cachebuster', Date.now());
  window.location.href = url.toString();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.onupdatefound = () => {
      const newSW = reg.installing;
      newSW.onstatechange = () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          newSW.postMessage('SKIP_WAITING');
        }
      };
    };
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('audit-form');
  const urlInput = document.getElementById('url-input');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.querySelector('.btn-text');
  const loader = document.querySelector('.loader');
  const errorMsg = document.getElementById('error-message');
  const resultsSection = document.getElementById('results-section');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();

    // Reset UI
    errorMsg.classList.add('hidden');
    resultsSection.classList.add('hidden');
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Populate data
      document.getElementById('res-status').textContent = data.status;
      document.getElementById('res-time').textContent = data.responseTime;
      document.getElementById('res-title').textContent = data.title;
      document.getElementById('res-desc').textContent = data.metaDescription;
      document.getElementById('res-h1').textContent = data.h1Count;
      
      const resAlt = document.getElementById('res-alt');
      resAlt.textContent = data.imagesMissingAlt;
      resAlt.style.color = data.imagesMissingAlt > 0 ? 'var(--error)' : 'var(--success)';
      
      document.getElementById('res-words').textContent = `~${data.wordCount}`;

      // Show results
      resultsSection.classList.remove('hidden');

    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.classList.remove('hidden');
    } finally {
      btnText.classList.remove('hidden');
      loader.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });
});

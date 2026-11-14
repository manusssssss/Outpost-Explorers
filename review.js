(() => {
  const form = document.getElementById('review-form');
  const rating = document.getElementById('review-rating');
  const message = document.getElementById('review-message');
  const status = document.getElementById('review-status');
  const button = form.querySelector('button[type="submit"]');
  const key = 'outpost-review-v1';
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && Number.isInteger(saved.rating) && saved.rating >= 1 && saved.rating <= 10 && typeof saved.message === 'string') { rating.value=String(saved.rating); message.value=saved.message; status.textContent='Your last review is saved in this browser.'; } } catch {}
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const review = {rating:Number(rating.value), message:message.value.trim()};
    if (!Number.isInteger(review.rating) || review.rating<1 || review.rating>10 || !review.message) {status.textContent='Please choose a rating and write a review.'; return;}
    let savedLocally=false;
    try {localStorage.setItem(key,JSON.stringify(review));savedLocally=true;} catch {}
    button.disabled=true; status.textContent='Sending your review…';
    try {
      const response=await fetch('https://outpost-review-mailer.outpost-explorers.workers.dev/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(review)});
      if (!response.ok) throw new Error('Review delivery failed');
      const result=await response.json();
      status.textContent=result.emailSent?(savedLocally?'Thanks! Your review was submitted and a copy was saved in this browser.':'Thanks! Your review was submitted, but this browser could not save a copy.'):(savedLocally?'Your review is saved here and in the site owner’s private inbox. Email delivery is temporarily unavailable.':'Your review is saved in the site owner’s private inbox. Email delivery is temporarily unavailable.');
    } catch {status.textContent=savedLocally?'Saved in this browser, but it could not be sent. Please try again later.':'Your review could not be sent or saved. Please copy your message and try again later.';}
    finally {button.disabled=false;}
  });
})();

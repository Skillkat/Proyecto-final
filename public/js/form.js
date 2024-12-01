document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    await fetch('/api/products', {
        method: 'POST',
        body: formData,
    });

    window.location.href = '/';
});

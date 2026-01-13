function renderBooks(books) {
    const grid = document.getElementById('books-grid');
    const role = localStorage.getItem('userRole');
    grid.innerHTML = '';

    books.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = `p-6 rounded-2xl bg-white shadow-sm border animate__animated animate__fadeInUp`;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">${book.category}</span>
                <i class="fas fa-book text-gray-400"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">${book.title}</h3>
            <p class="text-gray-600 text-sm mb-4">${book.description || ''}</p>
            <div class="text-sm text-gray-500 mb-4"><i class="fas fa-user-nib ml-1"></i> ${book.author}</div>
            ${role === 'admin' ? `
                <div class="flex gap-2 border-t pt-4">
                    <button onclick="openEditModal(${book.id}, '${book.title}', '${book.author}', '${book.description}')" class="text-blue-500 text-sm hover:underline">تعديل</button>
                    <button onclick="handleDelete(${book.id})" class="text-red-500 text-sm hover:underline">حذف</button>
                </div>` : ''}
        `;
        grid.appendChild(card);
    });
}

async function handleDelete(id) {
    if (confirm('هل أنت متأكد؟')) {
        await API.deleteBook(id);
        renderBooks(await API.getBooks());
    }
}
const API_URL = "http://127.0.0.1:8000";

const API = {
    // جلب جميع الكتب
    async getBooks() {
        try {
            const response = await fetch(`${API_URL}/books`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching books:", error);
            return [];
        }
    },

    // البحث عن كتاب
    async searchBooks(query) {
        try {
            const response = await fetch(`${API_URL}/books/search?query=${query}`);
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // إضافة كتاب جديد (للأدمن)
    async addBook(bookData) {
        try {
            const response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });
            return await response.json();
        } catch (error) {
            alert("Failed to add book. Check if Backend is running.");
        }
    },

    // حذف كتاب (للأدمن)
    async deleteBook(id) {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: "DELETE"
            });
            return await response.json();
        } catch (error) {
            alert("Error deleting book.");
        }
    }
};
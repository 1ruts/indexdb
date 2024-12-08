/*
Student Name: Albin Garcia
Student ID: 24239703 
*/


let db;

        const request = indexedDB.open('SneakerSphereDB', 1);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            const objectStore = db.createObjectStore('products', { keyPath: 'id' });
            console.log('Database setup complete.');
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Database opened successfully.');
            loadProducts();
        };

        request.onerror = function (event) {
            console.error('Database error:', event.target.errorCode);
        };

        
        function addProduct() {
            const id = document.getElementById('id').value.trim();
            const description = document.getElementById('description').value.trim();
            const price = parseFloat(document.getElementById('price').value);
            const image = document.getElementById('image').value.trim();

           
            if (!id || !description || isNaN(price) || !image) {
                alert('Please fill in all fields correctly.');
                return;
            }

            
            const newProduct = { id, description, price, image };

            
            const transaction = db.transaction(['products'], 'readwrite');
            const objectStore = transaction.objectStore('products');
            const request = objectStore.add(newProduct);

            request.onsuccess = function () {
                console.log('Product added:', newProduct);
                loadProducts();
            };

            request.onerror = function () {
                alert('Product ID must be unique.');
            };

            
            document.getElementById('id').value = '';
            document.getElementById('description').value = '';
            document.getElementById('price').value = '';
            document.getElementById('image').value = '';
        }

        
        function loadProducts() {
            const transaction = db.transaction(['products'], 'readonly');
            const objectStore = transaction.objectStore('products');
            const request = objectStore.getAll();

            request.onsuccess = function (event) {
                const products = event.target.result;
                renderProducts(products);
            };
        }

        
        function renderProducts(products) {
            const productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.description}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td><img src="${product.image}" alt="${product.image}"></td>
                    <td><button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button></td>
                `;

                productTableBody.appendChild(row);
            });
        }

        
        function deleteProduct(id) {
            const transaction = db.transaction(['products'], 'readwrite');
            const objectStore = transaction.objectStore('products');
            const request = objectStore.delete(id);

            request.onsuccess = function () {
                console.log('Product deleted:', id);
                loadProducts();
            };
        }

        
        function clearAllProducts() {
            if (confirm('Are you sure you want to clear all products?')) {
                const transaction = db.transaction(['products'], 'readwrite');
                const objectStore = transaction.objectStore('products');
                const request = objectStore.clear();

                request.onsuccess = function () {
                    console.log('All products cleared.');
                    loadProducts();
                };
            }
        }

        
        document.getElementById('addProductBtn').addEventListener('click', addProduct);
        document.getElementById('clearBtn').addEventListener('click', clearAllProducts);
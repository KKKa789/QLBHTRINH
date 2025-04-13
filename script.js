document.addEventListener("DOMContentLoaded", function () {
    const newCustomerNameInput = document.getElementById("newCustomerName");
    const addCustomerBtn = document.getElementById("addCustomer");
    const productNameInput = document.getElementById("productName");
    const unitInput = document.getElementById("unit");
    const priceInput = document.getElementById("price");
    const addProductBtn = document.getElementById("addProduct");
    const customerSelect = document.getElementById("customerSelect");
    const searchProduct = document.getElementById("searchProduct");
    const productList = document.getElementById("productList");
    const generateInvoiceBtn = document.getElementById("generateInvoice");
    const displayCustomer = document.getElementById("displayCustomer");
    const invoiceList = document.getElementById("invoiceList");
    const totalAmountEl = document.getElementById("totalAmount");
    const confirmInvoiceBtn = document.getElementById("confirmInvoice");
    const viewHistoryBtn = document.getElementById("viewHistory");
    const historyModal = document.getElementById("historyModal");
    const historyContent = document.getElementById("historyContent");
    const closeHistoryBtn = document.getElementById("closeHistory");
    const deleteCustomerBtn = document.getElementById("deleteCustomer");

    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let customerProducts = JSON.parse(localStorage.getItem("customerProducts")) || {};
    let invoiceItems = [];
    let invoiceHistory = JSON.parse(localStorage.getItem("invoiceHistory")) || [];

    // Hàm chuẩn hóa chuỗi tiếng Việt để sắp xếp
    function normalizeVietnamese(str) {
        const vietnameseMap = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd',
            'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
            'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
            'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
            'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
            'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
            'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
            'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
            'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
            'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
            'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
            'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
            'Đ': 'D'
        };
        return str.replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/g, char => vietnameseMap[char] || char).toLowerCase();
    }

    // Cập nhật dropdown khách hàng
    function updateCustomerDropdown() {
        customerSelect.innerHTML = '<option value="">Chọn...</option>';
        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer;
            option.textContent = customer;
            customerSelect.appendChild(option);
        });
    }

    // Thêm khách hàng mới
    addCustomerBtn.addEventListener("click", () => {
        const newCustomer = newCustomerNameInput.value.trim();
        if (newCustomer && !customers.includes(newCustomer)) {
            customers.push(newCustomer);
            customerProducts[newCustomer] = customerProducts[newCustomer] || [];
            localStorage.setItem("customers", JSON.stringify(customers));
            localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
            newCustomerNameInput.value = "";
            updateCustomerDropdown();
        } else if (!newCustomer) {
            alert("Vui lòng nhập tên khách hàng!");
        }
    });

    // Xóa khách hàng
    deleteCustomerBtn.addEventListener("click", () => {
        const selectedCustomer = customerSelect.value;
        if (!selectedCustomer) {
            alert("Vui lòng chọn khách hàng để xóa!");
            return;
        }
        
        if (confirm(`Bạn có chắc muốn xóa khách hàng "${selectedCustomer}" và tất cả sản phẩm của họ không?`)) {
            customers = customers.filter(customer => customer !== selectedCustomer);
            delete customerProducts[selectedCustomer];
            localStorage.setItem("customers", JSON.stringify(customers));
            localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
            customerSelect.value = "";
            displayCustomer.textContent = "Khách hàng: Chưa chọn";
            productList.innerHTML = "";
            invoiceItems = [];
            renderInvoice();
            updateCustomerDropdown();
            alert(`Đã xóa khách hàng "${selectedCustomer}" thành công!`);
        }
    });

    // Hàm định dạng giá
    function formatPrice(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Xử lý input
    productNameInput.addEventListener("input", function (e) {
        e.target.value = capitalizeFirstLetterOnly(e.target.value);
    });
    unitInput.addEventListener("input", function (e) {
        e.target.value = capitalizeFirstLetterOnly(e.target.value);
    });
    newCustomerNameInput.addEventListener("input", function (e) {
        e.target.value = capitalizeWords(e.target.value);
    });
    priceInput.addEventListener("input", (e) => {
        let rawValue = e.target.value.replace(/\D/g, "");
        priceInput.value = rawValue ? formatPrice(rawValue) : "";
    });

    // Thêm sản phẩm
    addProductBtn.addEventListener("click", () => {
        const customer = customerSelect.value;
        if (!customer) {
            alert("Vui lòng chọn khách hàng!");
            return;
        }
        const name = productNameInput.value.trim();
        const unit = unitInput.value.trim();
        const price = parseFloat(priceInput.value.replace(/\./g, ""));

        if (!name || !unit || isNaN(price) || price <= 0) {
            alert("Vui lòng nhập đầy đủ và đúng thông tin sản phẩm.");
            return;
        }

        const product = { name, unit, price, quantity: 1 };
        customerProducts[customer] = customerProducts[customer] || [];
        customerProducts[customer].push(product);
        localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
        renderProductList(customer);
        productNameInput.value = "";
        unitInput.value = "";
        priceInput.value = "";
    });

    // Hiển thị danh sách sản phẩm
    function renderProductList(customer) {
        productList.innerHTML = "";
        if (!customer || !customerProducts[customer]) return;

        // Sắp xếp sản phẩm theo tên tiếng Việt
        const sortedProducts = customerProducts[customer].slice().sort((a, b) => {
            return normalizeVietnamese(a.name).localeCompare(normalizeVietnamese(b.name), 'vi');
        });

        sortedProducts.forEach((product, index) => {
            const originalIndex = customerProducts[customer].findIndex(p => p.name === product.name && p.unit === product.unit && p.price === product.price);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="select-product" data-index="${originalIndex}"></td>
                <td>${product.name}</td>
                <td><input type="number" min="1" value="${product.quantity}" class="quantity" data-index="${originalIndex}"></td>
                <td>${product.unit}</td>
                <td>${formatPrice(product.price.toString())}</td>
                <td><button class="delete-btn" data-index="${originalIndex}">Xóa</button></td>`;
            productList.appendChild(row);
        });

        document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("input", (e) => {
                const index = e.target.dataset.index;
                let newQuantity = parseInt(e.target.value);
                if (newQuantity < 1 || isNaN(newQuantity)) newQuantity = 1;
                customerProducts[customer][index].quantity = newQuantity;
                localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                if (confirm(`Bạn có muốn xóa sản phẩm "${customerProducts[customer][index].name}" không?`)) {
                    customerProducts[customer].splice(index, 1);
                    localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
                    renderProductList(customer);
                }
            });
        });
    }

    // Cập nhật khi thay đổi khách hàng
    customerSelect.addEventListener("change", (e) => {
        const selectedCustomer = e.target.value;
        renderProductList(selectedCustomer);
        searchProduct.value = "";
        displayCustomer.textContent = selectedCustomer ? `Khách hàng: ${selectedCustomer}` : "Khách hàng: Chưa chọn";
        invoiceItems = [];
        renderInvoice();
    });

    // Tìm kiếm sản phẩm
    searchProduct.addEventListener("input", function () {
        const searchTerm = searchProduct.value.trim().toLowerCase();
        const customer = customerSelect.value;
        if (!customer || !customerProducts[customer]) return;
        document.querySelectorAll("#productList tr").forEach(row => {
            const productName = row.children[1].textContent.toLowerCase();
            row.style.display = productName.includes(searchTerm) ? "" : "none";
        });
    });

    // Tạo hóa đơn
    generateInvoiceBtn.addEventListener("click", () => {
        const customer = customerSelect.value;
        if (!customer) {
            alert("Vui lòng chọn khách hàng để tạo hóa đơn!");
            return;
        }
        invoiceItems = [];
        const selectedCheckboxes = document.querySelectorAll(".select-product:checked");
        selectedCheckboxes.forEach(checkbox => {
            const index = checkbox.dataset.index;
            const quantityInput = checkbox.closest("tr").querySelector(".quantity");
            const quantity = parseInt(quantityInput.value);
            if (quantity <= 0 || isNaN(quantity)) {
                alert("Số lượng không hợp lệ.");
                return;
            }
            const product = customerProducts[customer][index];
            invoiceItems.push({ ...product, quantity, total: product.price * quantity });
        });

        if (invoiceItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để tạo hóa đơn.");
            return;
        }
        displayCustomer.textContent = `Khách hàng: ${customer}`;
        renderInvoice();
    });

    // Hiển thị hóa đơn
    function renderInvoice() {
        invoiceList.innerHTML = "";
        let total = 0;
        invoiceItems.forEach((item, index) => {
            total += item.total;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>
                    <button class="decrease-qty" data-index="${index}">-</button>
                    <input type="text" value="${item.quantity}" class="quantity-input" data-index="${index}" style="width: 60px; text-align: center;">
                    <button class="increase-qty" data-index="${index}">+</button>
                </td>
                <td>${item.unit}</td>
                <td>${formatPrice(item.price.toString())}</td>
                <td><button class="remove-invoice-item" data-index="${index}">Xóa</button></td>`;
            invoiceList.appendChild(row);
        });
        totalAmountEl.innerHTML = `<b>Tổng cộng: ${formatPrice(total.toString())}</b>`;

        // Event listeners for increase/decrease buttons
        document.querySelectorAll(".increase-qty").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                let currentQuantity = parseFloat(invoiceItems[index].quantity);
                if (isNaN(currentQuantity)) currentQuantity = 1;
                invoiceItems[index].quantity = (currentQuantity + 1).toFixed(2);
                invoiceItems[index].total = invoiceItems[index].quantity * invoiceItems[index].price;
                renderInvoice();
            });
        });

        document.querySelectorAll(".decrease-qty").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                let currentQuantity = parseFloat(invoiceItems[index].quantity);
                if (isNaN(currentQuantity)) currentQuantity = 1;
                if (currentQuantity > 0.01) {
                    invoiceItems[index].quantity = (currentQuantity - 1).toFixed(2);
                    invoiceItems[index].total = invoiceItems[index].quantity * invoiceItems[index].price;
                    renderInvoice();
                }
            });
        });

        // Event listener for manual quantity input
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("input", (e) => {
                const index = parseInt(e.target.dataset.index);
                let value = e.target.value.trim();
                
                if (value === "") return;

                value = value.replace(",", ".");

                let newQuantity = parseFloat(value);

                if (isNaN(newQuantity) || newQuantity < 0) {
                    newQuantity = 1;
                    e.target.value = newQuantity;
                } else {
                    invoiceItems[index].quantity = newQuantity.toString();
                }

                invoiceItems[index].total = newQuantity * invoiceItems[index].price;
                renderInvoice();
            });

            input.addEventListener("blur", (e) => {
                const index = parseInt(e.target.dataset.index);
                let value = e.target.value.trim().replace(",", ".");
                let newQuantity = parseFloat(value);
                
                if (isNaN(newQuantity) || newQuantity < 0) {
                    newQuantity = 1;
                    e.target.value = newQuantity;
                    invoiceItems[index].quantity = newQuantity.toString();
                } else {
                    e.target.value = newQuantity.toString().replace(".", ",");
                    invoiceItems[index].quantity = newQuantity.toString();
                }

                invoiceItems[index].total = newQuantity * invoiceItems[index].price;
                renderInvoice();
            });
        });

        document.querySelectorAll(".remove-invoice-item").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                invoiceItems.splice(index, 1);
                renderInvoice();
            });
        });
    }

    // Xác nhận hóa đơn
    confirmInvoiceBtn.addEventListener("click", () => {
        const customer = displayCustomer.textContent.replace("Khách hàng: ", "").trim();
        if (!customer || customer === "Chưa chọn") {
            alert("Vui lòng chọn khách hàng!");
            return;
        }
        if (invoiceItems.length === 0) {
            alert("Hóa đơn trống.");
            return;
        }

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        const invoiceData = {
            customerName: customer,
            date: formattedDate,
            items: invoiceItems.map(item => ({
                ...item,
                quantity: parseFloat(item.quantity),
                total: parseFloat(item.quantity) * item.price
            })),
            total: invoiceItems.reduce((sum, item) => sum + parseFloat(item.quantity) * item.price, 0)
        };
        invoiceHistory.push(invoiceData);
        localStorage.setItem("invoiceHistory", JSON.stringify(invoiceHistory));

        const invoiceWindow = window.open("", "_blank");
        invoiceWindow.document.write(`
            <html><head><title>Hóa Đơn</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; } 
                h2 { color: #333; } 
                table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } 
                th { background-color: #f4f4f4; } 
                .total-row { font-weight: bold; background-color: #f4f4f4; } 
                th:nth-child(2), td:nth-child(2) { width: 80px; text-align: center; }
                th:nth-child(3), td:nth-child(3) { width: 50px; text-align: center; }
                @media print { .print-button { display: none; } }
            </style></head>
            <body><div class="invoice-header"><h2>HÓA ĐƠN</h2><p>Ngày: ${formattedDate}</p></div>
            <h3>Khách hàng: ${customer}</h3><table><thead><tr><th>Tên sản phẩm</th><th>Số lượng</th><th>ĐVT</th><th>Giá</th><th>Thành tiền</th></tr></thead><tbody>
            ${invoiceItems.map(item => `<tr><td>${item.name}</td><td>${parseFloat(item.quantity).toString().replace(".", ",")}</td><td>${item.unit}</td><td>${formatPrice(item.price.toString())}</td><td>${formatPrice((parseFloat(item.quantity) * item.price).toFixed(0))}</td></tr>`).join("")}
            <tr class="total-row"><td colspan="4">Tổng cộng</td><td>${formatPrice(invoiceData.total.toFixed(0))}</td></tr></tbody></table><div class="print-button" style="display:none;"><button onclick="window.print()" style="display:none;">In hóa đơn</button></div></body></html>`);
        invoiceWindow.document.close();

        invoiceItems = [];
        renderInvoice();
    });

    // Xử lý lịch sử hóa đơn
    viewHistoryBtn.addEventListener("click", () => {
        historyContent.innerHTML = invoiceHistory.length === 0 ? "<p>Không có hóa đơn nào trong lịch sử.</p>" : invoiceHistory.map((invoice, index) => {
            const invoiceContent = `
                <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                    <h3>Hóa đơn #${index + 1}</h3>
                    <p>Khách hàng: ${invoice.customerName}</p>
                    <p>Ngày: ${invoice.date}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>ĐVT</th>
                                <th>Giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity.toString().replace(".", ",")}</td>
                                    <td>${item.unit}</td>
                                    <td>${formatPrice(item.price.toString())} VNĐ</td>
                                    <td>${formatPrice(item.total.toFixed(0))} VNĐ</td>
                                </tr>
                            `).join("")}
                            <tr style="font-weight: bold; background-color: #f4f4f4;">
                                <td colspan="4">Tổng cộng</td>
                                <td>${formatPrice(invoice.total.toFixed(0))} VNĐ</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="print-invoice" data-index="${index}" style="background-color: #007bff; color: white; margin-right: 10px; padding: 5px 10px; cursor: pointer;">In</button>
                    <button class="delete-invoice" data-index="${index}" style="background-color: #ff4444; color: white; margin-top: 10px; padding: 5px 10px; cursor: pointer;">Xóa</button>
                </div>`;

            return invoiceContent;
        }).join("");

        document.querySelectorAll(".print-invoice").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                const invoice = invoiceHistory[index];
                const printWindow = window.open("", "_blank");
                printWindow.document.write(`
                    <html><head><title>Hóa Đơn #${index + 1}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; } 
                        h2 { color: #333; } 
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } 
                        th { background-color: #f4f4f4; } 
                        .total-row { font-weight: bold; background-color: #f4f4f4; } 
                        th:nth-child(2), td:nth-child(2) { width: 80px; text-align: center; }
                        th:nth-child(3), td:nth-child(3) { width: 50px; text-align: center; }
                        @media print { .print-button { display: none; } }
                    </style></head>
                    <body><div class="invoice-header"><h2>HÓA ĐƠN #${index + 1}</h2><p>Ngày: ${invoice.date}</p></div>
                    <h3>Khách hàng: ${invoice.customerName}</h3><table><thead><tr><th>Tên sản phẩm</th><th>Số lượng</th><th>ĐVT</th><th>Giá</th><th>Thành tiền</th></tr></thead><tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity.toString().replace(".", ",")}</td>
                            <td>${item.unit}</td>
                            <td>${formatPrice(item.price.toString())}</td>
                            <td>${formatPrice(item.total.toFixed(0))}</td>
                        </tr>
                    `).join("")}
                    <tr class="total-row"><td colspan="4">Tổng cộng</td><td>${formatPrice(invoice.total.toFixed(0))}</td></tr></tbody></table></body></html>`);
                printWindow.document.close();
                printWindow.print();
            });
        });

        document.querySelectorAll(".delete-invoice").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (confirm(`Bạn có chắc muốn xóa hóa đơn #${parseInt(e.target.dataset.index) + 1} không?`)) {
                    invoiceHistory.splice(e.target.dataset.index, 1);
                    localStorage.setItem("invoiceHistory", JSON.stringify(invoiceHistory));
                    viewHistoryBtn.click();
                }
            });
        });

        historyModal.style.display = "block";
    });

    closeHistoryBtn.addEventListener("click", () => historyModal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === historyModal) {
            historyModal.style.display = "none";
        }
    });

    // Cập nhật danh sách ban đầu
    updateCustomerDropdown();
});

function capitalizeFirstLetterOnly(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

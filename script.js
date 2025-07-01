document.addEventListener("DOMContentLoaded", function () {
    // DOM element references
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
    const invoiceDate = document.getElementById("invoiceDate");

    // Initialize data from localStorage with error handling
    let customers = [];
    let customerProducts = {};
    let invoiceItems = [];
    let invoiceHistory = [];
    
    try {
        customers = JSON.parse(localStorage.getItem("customers")) || [];
        customerProducts = JSON.parse(localStorage.getItem("customerProducts")) || {};
        invoiceHistory = JSON.parse(localStorage.getItem("invoiceHistory")) || [];
    } catch (e) {
        console.error("Error parsing localStorage data:", e);
        alert("Không thể tải dữ liệu từ bộ nhớ. Vui lòng kiểm tra cài đặt trình duyệt.");
    }

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
        if (!customerSelect) return;
        customerSelect.innerHTML = '<option value="">Chọn...</option>';
        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer;
            option.textContent = customer;
            customerSelect.appendChild(option);
        });
    }

    // Thêm khách hàng mới
    if (addCustomerBtn && newCustomerNameInput) {
        addCustomerBtn.addEventListener("click", () => {
            const newCustomer = newCustomerNameInput.value.trim();
            if (newCustomer && !customers.includes(newCustomer)) {
                customers.push(newCustomer);
                customerProducts[newCustomer] = customerProducts[newCustomer] || [];
                try {
                    localStorage.setItem("customers", JSON.stringify(customers));
                    localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                    alert("Không thể lưu dữ liệu khách hàng!");
                }
                newCustomerNameInput.value = "";
                updateCustomerDropdown();
            } else if (!newCustomer) {
                alert("Vui lòng nhập tên khách hàng!");
            }
        });
    }

    // Xóa khách hàng
    if (deleteCustomerBtn && customerSelect) {
        deleteCustomerBtn.addEventListener("click", () => {
            const selectedCustomer = customerSelect.value;
            if (!selectedCustomer) {
                alert("Vui lòng chọn khách hàng để xóa!");
                return;
            }
            
            if (confirm(`Bạn có chắc muốn xóa khách hàng "${selectedCustomer}" và tất cả sản phẩm của họ không?`)) {
                customers = customers.filter(customer => customer !== selectedCustomer);
                delete customerProducts[selectedCustomer];
                try {
                    localStorage.setItem("customers", JSON.stringify(customers));
                    localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                    alert("Không thể lưu dữ liệu sau khi xóa khách hàng!");
                }
                customerSelect.value = "";
                if (displayCustomer) displayCustomer.textContent = "Chưa chọn";
                if (productList) productList.innerHTML = "";
                invoiceItems = [];
                renderInvoice();
                updateCustomerDropdown();
                alert(`Đã xóa khách hàng "${selectedCustomer}" thành công!`);
            }
        });
    }

    // Hàm định dạng giá
    function formatPrice(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Xử lý input
    if (productNameInput) {
        productNameInput.addEventListener("input", function (e) {
            e.target.value = capitalizeFirstLetterOnly(e.target.value);
        });
    }
    if (unitInput) {
        unitInput.addEventListener("input", function (e) {
            e.target.value = capitalizeFirstLetterOnly(e.target.value);
        });
    }
    if (newCustomerNameInput) {
        newCustomerNameInput.addEventListener("input", function (e) {
            e.target.value = capitalizeWords(e.target.value);
        });
    }
    if (priceInput) {
        priceInput.addEventListener("input", (e) => {
            let rawValue = e.target.value.replace(/\D/g, "");
            e.target.value = rawValue ? formatPrice(rawValue) : "";
        });
    }

    // Thêm sản phẩm
    if (addProductBtn) {
        addProductBtn.addEventListener("click", () => {
            const customer = customerSelect ? customerSelect.value : "";
            if (!customer) {
                alert("Vui lòng chọn khách hàng!");
                return;
            }
            const name = productNameInput ? productNameInput.value.trim() : "";
            const unit = unitInput ? unitInput.value.trim() : "";
            const price = priceInput ? parseFloat(priceInput.value.replace(/\./g, "")) : NaN;

            if (!name || !unit || isNaN(price) || price <= 0) {
                alert("Vui lòng nhập đầy đủ và đúng thông tin sản phẩm.");
                return;
            }

            const product = { name, unit, price, quantity: 1 };
            customerProducts[customer] = customerProducts[customer] || [];
            customerProducts[customer].push(product);
            try {
                localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
            } catch (e) {
                console.error("Error saving to localStorage:", e);
                alert("Không thể lưu dữ liệu sản phẩm!");
            }
            if (productNameInput) productNameInput.value = "";
            if (unitInput) unitInput.value = "";
            if (priceInput) priceInput.value = "";
            renderProductList(customer);
        });
    }

    // Hiển thị danh sách sản phẩm
    function renderProductList(customer) {
        if (!productList) return;
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
                <td><input type="text" class="quantity" data-index="${originalIndex}" value="${product.quantity.toString().replace('.', ',')}" style="width: 60px;"></td>
                <td>${product.unit}</td>
                <td>${formatPrice(product.price.toString())}</td>
                <td><button class="delete-btn" data-index="${originalIndex}">Xóa</button></td>`;
            productList.appendChild(row);
        });

        document.querySelectorAll(".quantity").forEach(input => {
            input.addEventListener("input", (e) => {
                let value = e.target.value.replace(',', '.');
                value = value.replace(/[^0-9.]/g, '');
                if (value.includes('.')) {
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts[1];
                    }
                }
                e.target.value = value.replace('.', ',');
                const quantity = parseFloat(value.replace(',', '.')) || 0;
                const index = e.target.dataset.index;
                if (quantity <= 0) {
                    alert("Số lượng phải lớn hơn 0!");
                    e.target.value = customerProducts[customer][index].quantity.toString().replace('.', ',');
                    return;
                }
                customerProducts[customer][index].quantity = quantity;
                try {
                    localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                    alert("Không thể lưu số lượng sản phẩm!");
                }
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                if (confirm(`Bạn có muốn xóa sản phẩm "${customerProducts[customer][index].name}" không?`)) {
                    customerProducts[customer].splice(index, 1);
                    try {
                        localStorage.setItem("customerProducts", JSON.stringify(customerProducts));
                    } catch (e) {
                        console.error("Error saving to localStorage:", e);
                        alert("Không thể lưu dữ liệu sau khi xóa sản phẩm!");
                    }
                    renderProductList(customer);
                }
            });
        });
    }

    // Cập nhật khi thay đổi khách hàng
    if (customerSelect) {
        customerSelect.addEventListener("change", (e) => {
            const selectedCustomer = e.target.value;
            renderProductList(selectedCustomer);
            if (searchProduct) searchProduct.value = "";
            if (displayCustomer) displayCustomer.textContent = selectedCustomer ? selectedCustomer : "Chưa chọn";
            invoiceItems = [];
            renderInvoice();
        });
    }

    // Tìm kiếm sản phẩm
    if (searchProduct) {
        searchProduct.addEventListener("input", function () {
            const searchTerm = searchProduct.value.trim().toLowerCase();
            const customer = customerSelect ? customerSelect.value : "";
            if (!customer || !customerProducts[customer]) return;
            document.querySelectorAll("#productList tr").forEach(row => {
                const productName = row.children[1].textContent.toLowerCase();
                row.style.display = productName.includes(searchTerm) ? "" : "none";
            });
        });
    }

    // Tạo hóa đơn
    if (generateInvoiceBtn) {
        generateInvoiceBtn.addEventListener("click", () => {
            const customer = customerSelect ? customerSelect.value : "";
            if (!customer) {
                alert("Vui lòng chọn khách hàng để tạo hóa đơn!");
                return;
            }
            invoiceItems = [];
            const selectedCheckboxes = document.querySelectorAll(".select-product:checked");
            if (selectedCheckboxes.length === 0) {
                alert("Vui lòng chọn ít nhất một sản phẩm để tạo hóa đơn.");
                return;
            }
            let valid = true;
            selectedCheckboxes.forEach(checkbox => {
                const index = checkbox.dataset.index;
                const quantityInput = checkbox.closest("tr").querySelector(".quantity");
                const quantity = parseFloat(quantityInput.value.replace(',', '.'));
                if (isNaN(quantity) || quantity <= 0) {
                    alert(`Số lượng không hợp lệ cho sản phẩm "${customerProducts[customer][index].name}".`);
                    valid = false;
                    return;
                }
                const product = customerProducts[customer][index];
                invoiceItems.push({ ...product, quantity, total: product.price * quantity });
            });

            if (!valid || invoiceItems.length === 0) return;
            if (displayCustomer) displayCustomer.textContent = customer;
            if (invoiceDate) {
                const currentDate = new Date();
                invoiceDate.textContent = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            }
            renderInvoice();
        });
    }

    // Hiển thị hóa đơn
    function renderInvoice() {
        if (!invoiceList || !totalAmountEl) return;
        invoiceList.innerHTML = "";
        let total = 0;
        invoiceItems.forEach((item, index) => {
            total += item.total;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td><input type="text" class="invoice-quantity" data-index="${index}" value="${item.quantity.toString().replace('.', ',')}" style="width: 60px;"></td>
                <td>${item.unit}</td>
                <td>${formatPrice(item.price.toString())}</td>
                <td>${formatPrice(item.total.toFixed(0))}</td>
                <td><button class="delete-invoice-btn" data-index="${index}">Xóa</button></td>`;
            invoiceList.appendChild(row);
        });
        totalAmountEl.textContent = formatPrice(total.toFixed(0));

        document.querySelectorAll(".invoice-quantity").forEach(input => {
            input.addEventListener("input", (e) => {
                let value = e.target.value.replace(',', '.');
                value = value.replace(/[^0-9.]/g, '');
                if (value.includes('.')) {
                    const parts = value.split('.');
                    if (parts.length > 2) {
                        value = parts[0] + '.' + parts[1];
                    }
                }
                e.target.value = value.replace('.', ',');
                const quantity = parseFloat(value.replace(',', '.')) || 0;
                const index = e.target.dataset.index;
                if (quantity <= 0) {
                    alert("Số lượng phải lớn hơn 0!");
                    e.target.value = invoiceItems[index].quantity.toString().replace('.', ',');
                    return;
                }
                invoiceItems[index].quantity = quantity;
                invoiceItems[index].total = invoiceItems[index].price * quantity;
                renderInvoice();
            });
        });

        document.querySelectorAll(".delete-invoice-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                if (confirm(`Bạn có muốn xóa sản phẩm "${invoiceItems[index].name}" khỏi hóa đơn không?`)) {
                    invoiceItems.splice(index, 1);
                    renderInvoice();
                }
            });
        });
    }

    // Xác nhận hóa đơn
    if (confirmInvoiceBtn) {
        confirmInvoiceBtn.addEventListener("click", () => {
            const customer = displayCustomer ? displayCustomer.textContent.trim() : "";
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
            try {
                localStorage.setItem("invoiceHistory", JSON.stringify(invoiceHistory));
            } catch (e) {
                console.error("Error saving to localStorage:", e);
                alert("Không thể lưu hóa đơn!");
            }

            const invoiceWindow = window.open("", "_blank");
            if (!invoiceWindow) {
                alert("Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra cài đặt chặn popup của trình duyệt.");
                return;
            }
invoiceWindow.document.write(`
    <html><head><title>Hóa Đơn</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; font-size: 22px; }
        .header-row strong { font-weight: bold; }
        .header-row .customer { margin: 0 20px; text-align: center; flex-grow: 1; }
        .contact-row { display: flex; justify-content: space-between; align-items: baseline; }
        .contact-row p:last-child { text-align: right; }
        p { margin: 5px 0; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 20px; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background-color: #ddd; font-weight: bold; text-align: center; } /* Căn giữa tiêu đề */
        td { text-align: left; } /* Căn trái nội dung ô */
        th:nth-child(2), td:nth-child(2) { text-align: left; } /* Đảm bảo cột Tên sản phẩm căn trái */
        th:nth-child(2) { text-align: center; } /* Ghi đè căn giữa cho tiêu đề Tên sản phẩm */
        .total-row { font-weight: bold; background-color: #ddd; }
        @media print { .print-button { display: none; } }
    </style></head>
    <body>
        <div class="header-row">
            <strong></strong>
            <div class="customer"><strong>Khách hàng: ${customer}</strong></div>
            <strong>HÓA ĐƠN</strong>
        </div>
        <div class="contact-row">
            <p><strong>Ngày:</strong> ${formattedDate}</p>
        </div>
        <table>
            <thead><tr><th>STT</th><th>Tên sản phẩm</th><th>Số lượng</th><th>ĐVT</th><th>Giá</th><th>Thành tiền</th></tr></thead>
            <tbody>
            ${invoiceItems.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity.toString().replace('.', ',')}</td>
                    <td>${item.unit}</td>
                    <td>${formatPrice(item.price.toString())}</td>
                    <td>${formatPrice((item.quantity * item.price).toFixed(0))}</td>
                </tr>
            `).join("")}
            <tr class="total-row"><td colspan="5">Tổng cộng</td><td>${formatPrice(invoiceData.total.toFixed(0))}</td></tr>
            </tbody>
        </table>
        <div class="print-button" style="display:none;"><button onclick="window.print()" style="display:none;">In hóa đơn</button></div>
    </body></html>`);
            invoiceWindow.document.close();

            invoiceItems = [];
            renderInvoice();
        });
    }

    // Xử lý lịch sử hóa đơn
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener("click", () => {
            if (!historyContent) return;
            historyContent.innerHTML = invoiceHistory.length === 0 ? "<p>Không có hóa đơn nào trong lịch sử.</p>" : invoiceHistory.map((invoice, index) => {
                const invoiceContent = `
                    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                        <div class="header-row">
                            <strong></strong>
                            <div class="customer"><strong>Khách hàng: ${invoice.customerName}</strong></div>
                            <strong>HÓA ĐƠN</strong>
                        </div>
                        <div class="contact-row">
                      <p><strong>Ngày:</strong> ${invoice.date}</p>
                        </div>
                   
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>ĐVT</th>
                                    <th>Giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items.map((item, itemIndex) => `
                                    <tr>
                                        <td>${itemIndex + 1}</td>
                                        <td>${item.name}</td>
                                        <td>${item.quantity.toString().replace('.', ',')}</td>
                                        <td>${item.unit}</td>
                                        <td>${formatPrice(item.price.toString())} VNĐ</td>
                                        <td>${formatPrice(item.total.toFixed(0))} VNĐ</td>
                                    </tr>
                                `).join("")}
                                <tr style="font-weight: bold; background-color: #ddd;">
                                    <td colspan="5">Tổng cộng</td>
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
                    if (!printWindow) {
                        alert("Không thể mở cửa sổ in hóa đơn. Vui lòng kiểm tra cài đặt chặn popup của trình duyệt.");
                        return;
                    }
                    printWindow.document.write(`
                        <html><head><title>Hóa Đơn #${index + 1}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; font-size: 22px; }
                            .header-row strong { font-weight: bold; }
                            .header-row .customer { margin: 0 20px; text-align: center; flex-grow: 1; }
                            .contact-row { display: flex; justify-content: space-between; align-items: baseline; }
                            .contact-row p:last-child { text-align: right; }
                            p { margin: 5px 0; color: #333; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 17px; }
                            th, td { border: 1px solid #000; padding: 5px; text-align: center; }
                            th { background-color: #ddd; font-weight: bold; }
                            .total-row { font-weight: bold; background-color: #ddd; }
                            @media print { .print-button { display: none; } }
                        </style></head>
                        <body>
                            <div class="header-row">
                                <strong></strong>
                                <div class="customer"><strong>Khách hàng: ${invoice.customerName}</strong></div>
                                <strong>HÓA ĐƠN</strong>
                            </div>
                            <div class="contact-row">
                             
                             <p><strong>Ngày:</strong> ${invoice.date}</p>
                            </div>
         
                            <table>
                                <thead><tr><th>STT</th><th>Tên sản phẩm</th><th>Số lượng</th><th>ĐVT</th><th>Giá</th><th>Thành tiền</th></tr></thead>
                                <tbody>
                                ${invoice.items.map((item, itemIndex) => `
                                    <tr>
                                        <td>${itemIndex + 1}</td>
                                        <td>${item.name}</td>
                                        <td>${item.quantity.toString().replace('.', ',')}</td>
                                        <td>${item.unit}</td>
                                        <td>${formatPrice(item.price.toString())}</td>
                                        <td>${formatPrice(item.total.toFixed(0))}</td>
                                    </tr>
                                `).join("")}
                                <tr class="total-row"><td colspan="5">Tổng cộng</td><td>${formatPrice(invoice.total.toFixed(0))}</td></tr>
                                </tbody>
                            </table>
                        </body></html>`);
                    printWindow.document.close();
                    printWindow.print();
                });
            });

            document.querySelectorAll(".delete-invoice").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    if (confirm(`Bạn có chắc muốn xóa hóa đơn #${parseInt(e.target.dataset.index) + 1} không?`)) {
                        invoiceHistory.splice(e.target.dataset.index, 1);
                        try {
                            localStorage.setItem("invoiceHistory", JSON.stringify(invoiceHistory));
                        } catch (e) {
                            console.error("Error saving to localStorage:", e);
                            alert("Không thể lưu dữ liệu sau khi xóa hóa đơn!");
                        }
                        viewHistoryBtn.click();
                    }
                });
            });

            if (historyModal) historyModal.style.display = "block";
        });
    }

    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener("click", () => {
            if (historyModal) historyModal.style.display = "none";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === historyModal) {
            if (historyModal) historyModal.style.display = "none";
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

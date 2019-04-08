var bookDataFromLocalStorage = [];

function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

function a(s) {
    bookDataInquire=[];
  
    if (s == "") {
        bookDataInquire = JSON.parse(localStorage.getItem('bookData'));
    } else {
        bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
        for (var i = 0, max = bookDataFromLocalStorage.length; i < max; i++) {
            if (bookDataFromLocalStorage[i].BookName == s || bookDataFromLocalStorage[i].BookAuthor == s) {
                bookDataInquire.push(bookDataFromLocalStorage[i]);
            }
        }
    }
   
    $("#book_grid").kendoGrid({
        dataSource: {
            type: "odata",
            data: bookDataInquire,
            pageSize: 20,
        },
        height: 550,
        toolbar: kendo.template($("#template").html()), 
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            {command: [
                    {name: "刪除", click: function (e) {
                            e.preventDefault();
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            kendo.confirm("確定刪除「" + data.BookName + "」嗎?").then(function () {
                                bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
                                n = 0;
                                for (var i = 0, max = bookDataFromLocalStorage.length; i < max; i++) {
                                    if (bookDataFromLocalStorage[i].BookId == data.BookId) {
                                        break;
                                    } else {
                                        n++
                                    }
                                }
                                bookDataFromLocalStorage.splice(n, 1);
                                localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
                            
                                grid.dataSource.remove(data);
                            }, function () {
                            });
                        }
                    }
                ]},
            {field: "BookId", title: "書籍編號", },
            {field: "BookName", title: "書籍名稱", },
            {field: "BookCategory", title: "書籍種類", },
            {field: "BookAuthor", title: "作者", },
            {field: "BookBoughtDate", title: "購買日期", format: "{0: yyyy-MM-dd}"},
            {field: "BookDeliveredDate", title: "送達狀況", attributes: {class: "fa fa-paper-plane"}},
            {field: "BookPrice", title: "金額", format: "{0:0,0}", attributes: {style: "text-align: right;"}},
            {field: "BookAmount", title: "數量", format: "{0:N0}", attributes: {style: "text-align: right;"}},
            {field: "BookTotal", title: "總計", format: "{0:0,0元}", attributes: {style: "text-align: right;"}},
        ],
        editable: true,
    });
}
$(function () {

    loadBookData();

    kendo.culture("zh-TW");

    $(add_book).click(function () {
        $("#window").data("kendoWindow").center().open();
    });

    $("#window").kendoWindow({
        width: "600px",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    });

    $("#book_price").kendoNumericTextBox({
        spin: onSpin
    });
    $("#book_amount").kendoNumericTextBox({
        spin: onSpin
    });
    function onSpin() {
        document.getElementById("book_total").innerHTML = $("#book_price").val() * $("#book_amount").val();
    }

    $("#bought_datepicker").kendoDatePicker({
        parseFormats: ["yyyyMMdd", "yyyy/MM/dd", "yyyy-MM-dd"],
        value: new Date(),
        min: new Date(),
        format: "yyyy-MM-dd"
    });
    $("#delivered_datepicker").kendoDatePicker({
        parseFormats: ["yyyyMMdd", "yyyy/MM/dd", "yyyy-MM-dd"],
        min: new Date($("#bought_datepicker").val()),
        format: "yyyy-MM-dd"
    });

    var viewModel = kendo.observable({
        imageSrc: null,
        bookCategoryList: [
            {name: "資料庫", url: "image/database.jpg"},
            {name: "網際網路", url: "image/internet.jpg"},
            {name: "應用系統整合", url: "image/system.jpg"},
            {name: "家庭保健", url: "image/home.jpg"},
            {name: "語言", url: "image/language.jpg"},
        ]
    });
    viewModel.imageSrc = viewModel.bookCategoryList[0].url;
    kendo.bind($("#window"), viewModel);
    var validator = $("#book_form").kendoValidator().data("kendoValidator");

    $(save_book).click(function () {
        if (validator.validate()) {
            bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData')); 
            bookDataFromLocalStorage.push(
                    {
                        "BookId": JSON.parse(localStorage.getItem('bookData')).length + 1, 
                        "BookCategory": viewModel.bookCategoryList[0].name,
                        "BookName": $("#book_name").val(),
                        "BookAuthor": $("#book_author").val(),
                        "BookBoughtDate": $("#bought_datepicker").val(),
                        "BookDeliveredDate": $("#delivered_datepicker").val(),
                        "BookPrice": $("#book_price").val(),
                        "BookAmount": $("#book_amount").val(),
                        "BookTotal": $("#book_price").val() * $("#book_amount").val()
                    }, );
            localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage)); 
            $("#window").data("kendoWindow").close();
        }
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            type: "odata",
            data: JSON.parse(localStorage.getItem('bookData')),
            pageSize: 20,
        },
        height: 550,
        toolbar: kendo.template($("#template").html()), 
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            {command: [
                    {name: "刪除", click: function (e) {
                            e.preventDefault();
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            kendo.confirm("確定刪除「" + data.BookName + "」嗎?").then(function () {
                                bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
                                n = 0;
                                for (var i = 0, max = bookDataFromLocalStorage.length; i < max; i++) {
                                    if (bookDataFromLocalStorage[i].BookId == data.BookId) {
                                        break;
                                    } else {
                                        n++
                                    }
                                }
                                bookDataFromLocalStorage.splice(n, 1);
                                localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
                                
                                grid.dataSource.remove(data);
                            }, function () {
                            });
                        }
                    }
                ]},
            {field: "BookId", title: "書籍編號", },
            {field: "BookName", title: "書籍名稱", },
            {field: "BookCategory", title: "書籍種類", },
            {field: "BookAuthor", title: "作者", },
            {field: "BookBoughtDate", title: "購買日期", format: "{0: yyyy-MM-dd}"},
            {field: "BookDeliveredDate", title: "送達狀況", attributes: {class: "fa fa-paper-plane"}},
            {field: "BookPrice", title: "金額", format: "{0:0,0}", attributes: {style: "text-align: right;"}},
            {field: "BookAmount", title: "數量", format: "{0:N0}", attributes: {style: "text-align: right;"}},
            {field: "BookTotal", title: "總計", format: "{0:0,0元}", attributes: {style: "text-align: right;"}},
        ],
        editable: true,
    });
}
);

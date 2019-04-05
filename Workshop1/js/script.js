
var bookDataFromLocalStorage = [];

//選擇種類
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg"},
    { text: "網際網路", value: "internet", src: "image/internet.jpg"},
    { text: "應用系統整合", value: "system", src: "image/system.jpg"},
    { text: "家庭保健", value: "home", src: "image/home.jpg"},
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

// 換圖片
$(document).ready(function () {

    function onChange() {
        kendo.ui.progress($("#grid"), true);
        var baseUrl = 'image/';
        $.getScript(baseUrl + this.value() + ".jpg", function () {
        });
    }

    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "資料庫" },
            { text: "網際網路" },
            { text: "應用系統整合" },
            { text: "家庭保健" },
            { text: "語言" }
        ],
        index: 0,
        change: onChange
    });

    $("#book_category").data("kendoDropDownList").trigger("onChange");

});


//gird本體
$("#book_grid").kendoGrid({
        dataSource: {
            data: bookData,
            pageSize: 20,
        },
        height: 550,

        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
    columns: [{
        command: { text: "刪除", click: delet },
            title: " ", width: "180px"
        },{
            field: "BookId",
            title: "書籍編號"
        }, {
            field: "BookName",
            title: "書籍名稱"
        }, {
            field: "BookCategory",
            title: "書籍種類"
        }, {
            field: "BookAuthor",
            title: "作者"
        }, {
            field: "BookBoughtDate",
            title: "購買日期"
        }, {
            field: "BookPublisher",
            title: "送達狀態"
        }, {
            field: "BookPrice",
            title: "金額"
        }, {
            field: "BookAmount",
            title: "數量"
        }, {
            field: "BookTotal",
            title: "總計"
        }]
});


//刪除FUNCTION

function delet(e) {
    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    wnd.content(detailsTemplate(dataItem));
    wnd.center().open();
}


//新增視窗

$('#add_book').click(function () {
    var myWindow = $("#book_form");

    myWindow.kendoWindow({
        width: "600px",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
    }).data("kendoWindow").center().open();


});

//日期判別
$(document).ready(function () {
    $("#bought_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd"
    });
    $("#delivered_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd"
    })
});


//金額數量判別
$(document).ready(function () {
    $("#book_price").kendoNumericTextBox(
        {
            format: "n0",
            min: 0
    });
    $("#book_amount").kendoNumericTextBox(
        {
            format: "n0",
            min: 0
        });
});
var price = $("#book_price").value;
var amount = $("#book_amount").value;

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
};


// 起始化做在同一個地方
$(document).ready(function () {
    // 載入書籍資料
    loadBookData();
    // 中文
    kendo.culture("zh-TW");
    // 新增視窗
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
    var tr = $(e.target).closest("tr");
    var data = this.dataItem(tr);
    kendo.confirm("確定刪除「" + data.BookName + "」嗎?").then(function () {
        bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
        n=0;
        for (var i = 0, max = bookDataFromLocalStorage.length; i < max; i++) {
            if (bookDataFromLocalStorage[i].BookId==data.BookId) {
                break;
            } else {
                n++
            }
        }
        bookDataFromLocalStorage.splice(n,1);
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
        //上面方法直接刪除loadBookData資料
        grid.dataSource.remove(data);//直接刪除grid的列
    }, function () {
    });
};



//金額數量判別
$("#book_price").kendoNumericTextBox(
    {
        format: "n0",
        min: 0,
        spin:onspin
});
$("#book_amount").kendoNumericTextBox(
    {
        format: "n0",
        min: 0,
        spin:onspin

    });
    function onspin(){
        document.getElementById("book_total").innerHTML = $("#book_price").val() * $("#book_amount").val();
    }

// 換圖片
    function onChange() {
        var value = $("#book_category").val;
        $("#image")
            .toggleClass("database", value == "database")
            .toggleClass("internet", value == "internet")
            .toggleClass("system", value == "system")
            .toggleClass("home", value == "home")
            .toggleClass("language", value == "language");

    }
//下拉
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: bookCategoryList,
        index: 0,
        change: onChange
    });

//日期判別
$("#bought_datepicker").kendoDatePicker({
    format: "yyyy-MM-dd",
    min: new Date(),
    value: new Date()
});
$("#delivered_datepicker").kendoDatePicker({
    format: "yyyy-MM-dd",
    min: new Date($("#bought_datepicker").val()),
})

    //notification.show("送達日期不可早於購買日期");
    $("#hideAllNotifications").click(function () {
        notification.hide();
    });

//提醒
var notification = $("#notification").kendoNotification({
    width: "12em",
    templates: [{
        type: "time",
        template: "<div style='padding: .6em 1em'>Time is: <span class='timeWrap'>#: time #</span></div>"
    }]
}).data("kendoNotification");





});
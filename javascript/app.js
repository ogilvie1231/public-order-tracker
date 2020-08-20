var database = firebase.database();

let totalCost = [];
let orderArr = [];
let openCostArr = [];
let completeCostArr = [];
let taxableArr = [];
let taxBatch = 0;
let fileUpload = {};
let orderUpload = {};
let url = "";
var storageRef = firebase.storage().ref();
var selectedFile;

$("#updateDiv").hide();

$("#new-order-btn").hide();

$("#new-order-btn").on("click", function (event) {
  event.preventDefault();
  let vendor = $("#vendor").val().trim();
  let cost = $("#cost").val().trim();
  let date = $("#datepicker").val().trim();
  let tax = $("#taxOption").val().trim();

  if (vendor === "") {
    alert("please enter the vendor");
  } else if (cost === "") {
    alert("Please enter the cost");
  } else if (isNaN(cost)) {
    alert("Cost must be a number");
  } else if (date === "") {
    alert("Please enter a date");
  } else if (url === "") {
  } else {
    let newOrder = {
      vendor,
      cost,
      date,
      complete: "open",
      tax,
      url,
    };
    database.ref().push(newOrder);
    window.location.reload();
  }
});

// Date Picker
$(function () {
  $("#datepicker").datepicker().attr("autocomplete", "off");
  $("#anim").on("change", function () {
    $("#datepicker").datepicker("option", "showAnim", $(this).val());
  });
});

// Date Picker for updates
$(function () {
  $("#eDatepicker").datepicker().attr("autocomplete", "off");
  $("#anim").on("change", function () {
    $("#eDatepicker").datepicker("option", "showAnim", $(this).val());
  });
});

let addCost = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#totalCostDisp").text("$" + formatSum);
};

let addCostOpen = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#openCostDisp").text("$" + formatSum);
};

let addCostComplete = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#completeCostDisp").text("$" + formatSum);
};


let calcTax = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = sum * taxPer;
  let formatTax = taxAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  $("#totalTaxDisp").text("      $" + formatTax + ' ');
  taxBatch = taxAmount;
};

let updateBtn = (id) => {
  $("#updateBtn").on("click", function (event) {
    let vendor = $("#eVendor").val().trim();
    let cost = $("#eCost").val().trim();
    let date = $("#eDatepicker").val().trim();
    let tax = $("#eTaxOption").val().trim();

    database.ref(id).update({
      vendor,
      cost,
      date,
      complete: "open",
      tax,
      url,
    });
  });
};

let editBtn = (id, curVendor, curCost, curOrderDate, curTaxStat) => {
  $("#" + id + "e" + "").on("click", function () {
    $("#updateDiv").show();
    $("#eVendor").val(curVendor);
    $("#eCost").val(curCost);
    $("#eDatepicker").val(curOrderDate);
    $("#eTaxOption").val(curTaxStat);
    // $('#sampleView').html('<iframe class="previewImg" src="' + url + '" alt="preview">')
    updateBtn(id);
    $("#updateBtn").hide();
  });
};

let completeBtn = (id) => {
  $("#" + id + "").on("click", function () {
    database.ref(id).update({
      complete: "complete",
    });
    window.location.reload();
  });
};

let deleteBtn = (id) => {
  $("#" + id + "d" + "").on("click", function () {
    database.ref(id).remove();
    window.location.reload();
  });
};

let openBtn = (id) => {
  $("#" + id + "").on("click", function () {
    database.ref(id).update({
      complete: "open",
    });
    window.location.reload();
  });
};

let closeBtn = (id) => {
  $("#" + id + "f" + "").on("click", function () {
    database.ref(id).update({
      complete: "closed",
    });
    window.location.reload();
  });
};

let batchOut = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = (sum * taxPer).toFixed(2);
  $("#totalTaxDisp").text("$" + taxAmount);

  $("#batchBtn").on("click", function (event) {
    event.preventDefault();
  });
};

let handleFileSelect = (event) => {
  selectedFile = event.target.files[0];

  // let fileVendor = $("#vendor").val();

  fileUpload = selectedFile;

  // Create the file metadata
  // var metadata = {
  //   contentType: "image/jpeg",
  //   name: fileVendor,
  // };
  var uploadTask = storageRef
    .child("orders/" + fileUpload.name)
    .put(fileUpload);
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("File available at", downloadURL);
        url = downloadURL;
        $("#new-order-btn").show();
        $("#updateBtn").show();
      });
    }
  );
};

let retreive = () => {
  database.ref().on("child_added", function (childSnapshot) {
    orderArr.push(childSnapshot.val());

    let vendor = childSnapshot.val().vendor;
    let cost = childSnapshot.val().cost;
    let orderDate = childSnapshot.val().date;
    let itemKey = childSnapshot.key;
    let taxStat = childSnapshot.val().tax;
    let orderUrl = childSnapshot.val().url;

    if (childSnapshot.val().complete === "open") {
      openCostArr.push(parseInt(cost));
    }

    addCostOpen(openCostArr);

    if (childSnapshot.val().complete === "complete") {
      completeCostArr.push(parseInt(cost));
    }
    addCostComplete(completeCostArr);
    
    if (childSnapshot.val().complete === "open" ||
    childSnapshot.val().complete === "complete") {
      totalCost.push(parseInt(cost));
    }

    addCost(totalCost);

    if (
      (childSnapshot.val().tax === "Taxable" &&
        childSnapshot.val().complete === "open") ||
      (childSnapshot.val().tax === "Taxable" &&
        childSnapshot.val().complete === "complete")
    ) {
      taxableArr.push(parseInt(cost));
    }
    if (childSnapshot.val().complete == "open") {
      let newOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow("d")),
        $("<td>").text(taxStat),
        $("<td>").html(
          '<a class="viewLink" target="_blank" href="' + orderUrl + '">View</a>'
        ),
        $("<td>").html(
          '<button key="' +
            itemKey +
            '" id="' +
            itemKey +
            '" class="btn btn-primary delete-btn">Complete</button>'
        ),
        $("<td>").html(
          '<button key="' +
            itemKey +
            '" id="' +
            itemKey +
            "e" +
            '" class="btn btn-primary delete-btn">Edit</button>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            "d" +
            '" class="btn btn-primary delete-btn">Delete</button>'
        )
      );

      $("#open-orders > tbody").append(newOrderInfo);
      completeBtn(itemKey);
      editBtn(itemKey, vendor, cost, orderDate, taxStat);
      deleteBtn(itemKey);
    } else if (childSnapshot.val().complete == "complete") {
      let closedOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
        $("<td>").text(taxStat),
        $("<td>").html(
          '<a class="viewLink" target="_blank" href="' + orderUrl + '">View</a>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            '" class="btn btn-primary delete-btn">Open</button>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            "f" +
            '" class="btn btn-primary delete-btn">Close</button>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            "d" +
            '" class="btn btn-primary delete-btn">Delete</button>'
        )
      );
      $("#complete-orders > tbody").append(closedOrderInfo);
      openBtn(itemKey);
      closeBtn(itemKey);
      deleteBtn(itemKey);
    } else if (childSnapshot.val().complete == "closed") {
      let closedOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
        $("<td>").text(taxStat),
        $("<td>").html(
          '<a class="viewLink" target="_blank" href="' + orderUrl + '">View</a>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            '" class="btn btn-primary delete-btn">Open</button>'
        ),
        $("<td>").html(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            "d" +
            '" class="btn btn-primary delete-btn">Delete</button>'
        )
      );
      $("#closed-orders > tbody").append(closedOrderInfo);

      completeBtn(itemKey);
      deleteBtn(itemKey);
    }
    calcTax(taxableArr);

    if (taxableArr > 0) {
      batchOut(taxableArr);
    }
  });
};

retreive();

$(document).ready(function () {
    $('#productsTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                title: 'Export Products',
                exportOptions: {
                    columns: ':not(:last-child)',
                    alignment: 'center',
                },
                customize: function (doc) {
                    doc.content[1].table.widths = ['*','*','*','*'];
                }
            },
            {
                extend: 'excel',
                text: 'Excel',
                title: 'Export Products',
                exportOptions: {
                    columns: ':not(:last-child)',
                    modifier: {
                        selected: true
                    },
                },
            },
            {
                extend: 'print',
                text: 'Print',
                title: 'Export Products',
                exportOptions: {
                    columns: ':not(:last-child)',
                },

            },
            {
                extend: 'copy',
                text: 'Copy',
                title: 'Export Products',
                exportOptions: {
                    columns: ':not(:last-child)',
                },

            }

        ]
    });
})
function deleteProduct(value) {
    $.ajax({
        url: `delete-export-product/${value}`,
        success: function (e) {
            if (e.status == 'success') {
                showNotification(e.msg);
                getPtoductsForDatatable();

            }
        }
    })
}
function showNotification(msg) {
    $('#notifDiv').css('background', 'green').fadeIn();
    $('#notifDiv').text(msg);
    setTimeout(() => {
        $('#notifDiv').fadeOut();
    }, 3000);
}
function getPtoductsForDatatable() {
    if ($.fn.DataTable.isDataTable("#productsTable")) {
        $('#productsTable').DataTable().clear().destroy();
    }
    $.ajax({
        url: `/get-export-products`,
        success: function (e) {
            if (e.length > 0) {
                $('#tableBody').empty();
                e.forEach((element, key) => {
                    $('#tableBody').append(` <tr id="row-{{$product->id}}">
                <td>${key + 1}</td>
                <td>${element.name}</td>
                <td>${element.sku}</td>
                <td>${element.category.category_name}</td>
                <td>
                    <a href="/export-product-form/${element.id}" class="btn btn-default btn-line edit-btn">Edit</a>
                    <button class="btn btn-default btn-line" type="button" onclick="deleteProduct(${element.id})">Delete</button>
                </td>
                </tr>`);

                });
                $('#productsTable').DataTable();
            }
        }
    })
}
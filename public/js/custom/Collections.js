var all_inventory = [];
var addedProducts = [];
var segments = location.href.split('/');
$(function() {

    if (segments[3] == 'CreateCollection')
        GetInventory();
    else if (segments[3] == 'Collections')
        $('table').DataTable()

    $(document).on('click', '.add_product', function() {
        addedProducts.push(all_inventory.find(x => x.id == $(this).attr('product-id')))
        $(this).parent().append(`
            <button class="btn btn-default mb-0" style="cursor: default">Added</button>
        `)
        $(this).remove();
        renderAddedProducts(addedProducts)
    })

    $(document).on('input', '.searchAddedProducts', function() {
        renderAddedProducts(addedProducts.filter(x => x.name.toLowerCase().includes($(this).val().toLowerCase())))
    })

    $(document).on('click', '.remove_added_item', function() {
        addedProducts = addedProducts.filter(x => x.id != $(this).attr('product-id'));
        $(this).parents('tr').remove()
        renderInventory();
    });

    $('.saveCollection').click(function() {
        if (!addedProducts.length || !$('#collectionName').val()) {
            $('#notifDiv').css('background', 'red').text('Please provide all the required information (*)').fadeIn();
            setTimeout(() => {
                $('#notifDiv').fadeOut();
            }, 3000);
            return;
        }
        $(this).attr('disabled', 'disabled').text('Saving..')
        $.ajax({
            type: 'POST',
            url: `/SaveCollection${ segments[3] == 'CreateCollection' && segments[4] ? '/'+ segments[4] : '' }`,
            data: {
                _token: csrfToken,
                collectionName: $('#collectionName').val(),
                description: JSON.stringify($("#CollectionSummernote").val()),
                products: JSON.stringify(addedProducts)
            },
            success: function(x) {
                if (x.code == 200) {
                    $('.saveCollection').text('Saved')
                    $('#notifDiv').css('background', 'green').text('Collection saved successfully').fadeIn();
                    setTimeout(() => {
                        location.href = "/Collections"
                        $('#notifDiv').fadeOut();
                    }, 3000);
                } else {
                    $('#notifDiv').css('background', 'red').text('An error occurred').fadeIn();
                    setTimeout(() => {
                        $('#notifDiv').fadeOut();
                    }, 3000);
                    $('.saveCollection').text('Save').removeAttr('disabled');
                }
            }
        })
    })

})

function GetInventory() {
    $('.tblLoader').show();
    $.ajax({
        type: 'GET',
        url: `/GetInventory${ segments[3] == 'CreateCollection' && segments[4] ? '/'+ segments[4] : '' }`,
        success: function(response) {
            all_inventory = response.products;
            response.collection_items.forEach(x => {
                addedProducts.push(all_inventory.find(y => y.id == x.product_id))
            })
            renderInventory();
        }
    });
}

function renderAddedProducts(products) {
    $('.added_products_list').empty();
    products.forEach(p => {
        $('.added_products_list').append(`
        <tr class="added_rows">
            <td>
                <div class="Pro-IN">
                    <div class="CP-name">${p['name']}</div>
                </div>
            </td>
            <td>
            </td>
            <td align="right">
                <a class="RLDelete m-0 remove_added_item" product-id="${p['id']}"><i class="fa fa-times"></i></a>
            </td>
        </tr>`);
    });
}

function renderInventory() {
    $('.body_inventory').empty();
    $('.body_inventory').append('<table class="table table-hover dt-responsive nowrap inventory_table" style="width:100%"><thead><tr><th>ITEM SKU</th><th>ITEM NAME</th><th>ITEM BRAND</th><th>ACTIONS</th></tr></thead></tbody><tbody></tbody></table>');

    $('.inventory_table tbody').empty();
    all_inventory.forEach(p => {
        $('.inventory_table tbody').append(`<tr>
            <td>${p['sku']}</td>
            <td>
                 ${p['name']}
            </td>
            <td>${p['brand']}</td>
            <td>
                <button product-id="${p['id']}" class="btn btn-default ${ addedProducts.find(x => x && x.id == p.id) ? '' : 'btn-line' } mb-0 ${ addedProducts.find(x => x && x.id == p.id) ? '' : 'add_product' }">${ addedProducts.find(x => x && x.id == p.id) ? 'Added' : 'Add' }</button>
            </td>
        </tr>`);
    })
    $('.tblLoader').hide();
    $('.inventory_table').DataTable();
    if (segments[4])
        renderAddedProducts(addedProducts)
}


$(document).ready(function() {
    $("#CollectionSummernote").summernote(SummerNoteSetting);
});
Dropzone.autoDiscover = false;
let subNavItems = [];
let parentModRef = null;
let editSubNavItem = null;


$(document).ready(function() {

    navItemsScript();
    actionListeners();

    $(".datepicker").datepicker({
        format: "yyyy-mm-dd"
    });

    $('#productlist01').click(function() {
        if ($('#product-cl-sec').hasClass('active')) {
            closeSidebar()
        } else {
            openSidebar()
        }
    });

    $("#example").DataTable();

    $(".table-PL").dataTable({
        searching: false,
        paging: false,
        info: false
    });

    $("#pl-close, .close-sidebar, .overlay").on("click", function() {
        closeSidebar();
    });

    $(document).on("click", ".closeProductAddSidebar", function() {
        closeSidebar();
    });

    $(document).on("click", "#SN-close, .overlay-blure", function() {
        closeSubNav();
    });

    $(document).on("click", "#SN-close, .overlay-for-sidebar", function() {
        closeSidebar();
    });

    $(document).on("click", ".openSubMenu", function() {
        let name = $(this).attr("attr-name");
        let item = subNavItems.find(
            x => x.parent.toLowerCase() == name.toLowerCase()
        );
        $("#subNavItems").empty();
        $("#subNavHeader").html(item.parent);
        item.child.forEach(element => {
            $("#subNavItems").append(element);
        });
        closeSidebar();
        openSubNav();
    });


    $(document).on('click', '.open_search_modal', function(){
        $('.SearchList').empty();
        $('#tblLoader_search').hide();
        $('.search_whole_site').val('');
    });

    $(document).on('input', '.search_whole_site', function(){
        if($(this).val().length > 2){
            $('.SearchList').empty();
            $('#tblLoader_search').show();
            fetchSiteSearchReasult($(this).val());
        }else if($(this).val() == ''){
            $('.SearchList').empty();
            $('#tblLoader_search').hide();
        }
    });

});

$(".form-control")
    .on("focus blur", function(e) {
        $(this)
            .parent()
            .toggleClass(
                "focused",
                e.type === "focus" || this.value.length > 0
            );
    })
    .trigger("blur");
$(".formselect").select2();
$(".sd-type").select2({
    createTag: function(params) {
        var term = $.trim(params.term);
        if (term === "") {
            return null;
        }
        return {
            id: term,
            text: term,
            newTag: true // add additional parameters
        };
    }
});

function renderPage() {
    if (controller == "Customer") {
        if (currentSegment == "CustomerCorrespondence")
            $.getScript('/js/custom/CustomerCorrespondence.js?v=1.0');
        else
            $.getScript("/js/custom/customer.js?v=2.4");
    } else if (controller == "CustomerTypes") {
        $.getScript("/js/custom/customer-types.js?v=1.2.0");
    } else if (controller == "ProspectCustomers") {
        $.getScript("/js/custom/prospect-customers.js?v=1.2.2");
    } else if (controller == "Suppliers") {
        $.getScript("/js/custom/suppliers.js?v=1.2.1");
    } else if (controller == "AccessRights") {
        $.getScript("/js/custom/access_rights.js?v=1.2.0");
    } else if (controller == "Notifications") {
        $.getScript("/js/custom/notifications.js?v=1.2.0");
    } else if (controller == "RegisterController") {
        $.getScript("/js/custom/employee.js?v=1.2.1");
    } else if (controller == "Categories") {
        $.getScript("/js/custom/categories.js?v=1.2.0");
    } else if (controller == "Units") {
        $.getScript("/js/custom/units.js?v=1.2.0");
    } else if (controller == "Variants") {
        $.getScript("/js/custom/variants.js?v=1.2.0");
    } else if (controller == "Shipping") {
        $.getScript("/js/custom/shipping_company.js?v=1.2.0");
    } else if (controller == "DeliveryPorts") {
        $.getScript("/js/custom/ports.js?v=1.2.0");
    } else if (controller == "Orders" || controller == "OrderManagement" || controller == "Dispatch") {
        $.getScript("/js/custom/orders.js?v=1.3.0");
    } else if (controller == "Correspondence") {
        $.getScript("https://cloud.tinymce.com/stable/tinymce.min.js", () => {
            $.getScript("/js/custom/correspondence.js?v=1.2.0");
        });
    } else if (controller == "Products") {
        $.getScript("/js/custom/product.js?v=2.2");
        $.getScript("/js/jquery.steps.min.js?v=2.0");
        $.getScript("/js/form-wizard-data.js");
    } else if (controller == "PNLController") {
        $.getScript("/js/custom/pnl.js?v=1.2");
    } else if (controller == "PaymentController") {
        $.getScript("/js/custom/payment.js?v=1.0");
    } else if (controller == 'ForwarderController') {
        $.getScript('/js/custom/forwarder.js?v=1.1');
    }
    $('#contentContainerDiv').removeClass('blur-div');
}

function actionListeners() {
    $(document).on("click", ".deleteSubNavItem", function() {
        if (!window.confirm("Are you sure you want to delete this item?")) return
        let itemId = $(this).attr('item-id')
        $(this).parent().remove();
        $.ajax({
            type: 'POST',
            url: '/Admin/DeleteSubNavItem',
            data: {
                _token: $('input[name="_token"]').val(),
                id: itemId
            },
            success: function() {
                location.reload()
            }
        })
    });

    $(document).on("click", ".savePriorityList", function() {
        let priorityList = [];
        let priority = 1;
        $(this).text('Saving..')
        $(this).parent().parent().find('li').not('.addNewSubMob').each(function() {
            priorityList.push({
                id: $(this).attr('item-id'),
                priority: priority++
            });
        });
        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateSubModPriority',
            data: {
                _token: $('input[name="_token"]').val(),
                data: priorityList
            },
            success: function(response) {
                location.reload();
            }
        })
    });

    $(document).on("keydown", ".parentModEditor", function(e) {
        if (e.keyCode == 13) {
            $(this).attr('disabled', true);
            $.ajax({
                type: 'POST',
                url: '/Admin/UpdateParentMod',
                data: {
                    _token: $('input[name="_token"]').val(),
                    old_parent_mod: $(this).attr('module-name'),
                    parentMod: $(this).val()
                },
                success: function(response) {
                    location.reload();
                }
            })
        }
    });

    $(document).on("click", ".deleteParentMod", function() {
        let itemFnd = allControllersData.find(x => x.parent_module == $(this).attr('parent-module')).parent_module
        if (!window.confirm('This action will delete this item permanently'))
            return;

        $(this).text('Deleting');
        $.ajax({
            type: 'POST',
            url: '/Admin/DeleteParentMod',
            data: {
                _token: $('input[name="_token"]').val(),
                parent_module: itemFnd
            },
            success: function() {
                location.reload();
            }
        })
    });

    $(document).on("click", ".parentMod", function() {
        let itemFnd = allControllersData.find(x => x.parent_module == $(this).text())

        $(".openSubModModal").click();
        $('#exampleModalLabel').text('Parent Module Settings');
        $('#newSubModForm').hide();
        $('#newParentModForm').show();

        $('[name="parent_op"]').val('update');
        $('#newParentModForm').append(`<input name="parent_module_name_update" value="${itemFnd.parent_module}" hidden />`);
        $('[name="parent_module_name_update"]').val(itemFnd.parent_module);
        $('[name="parent_module_name"]').val(itemFnd.parent_module);
        $('[name="show_in_sidebar"]').val(itemFnd.show_in_sidebar);
        setTimeout(() => {
            $('[name="parent_module_name"]').focus();
        }, 500);

        $('#saveParentMod').show();
        $('#saveNewSubMod').hide();
    });

    $(document).on("click", "#saveNewSubMod", function() {
        let updateItemId = parentModRef.attr('item-id');
        let parentMod = parentModRef
            .parent()
            .parent()
            .parent()
            .find("span")
            .text();

        let currentPriority = 1;

        let allItemsWithoutAddLi = parentModRef
            .parent()
            .find("li")
            .not(".addNewSubMob");

        allItemsWithoutAddLi.each(function() {
            if (updateItemId && parentModRef.text() == $(this).text()) {
                currentPriority = $(this).index() + 1;
            }
            if (!updateItemId)
                currentPriority++;
        });

        if (updateItemId)
            parentMod = parentModRef.attr('parent-module-name')

        $(this).text("Saving");
        $(this).attr("disabled", true);

        $("#newSubModForm").ajaxSubmit({
            type: "POST",
            url: "/Admin/SaveSubMod",
            data: {
                priority: currentPriority,
                item_id: updateItemId,
                parent: parentMod
            },
            success: function(response) {
                if (response.code == 200) {
                    $(".close").click();
                }

                location.reload();

                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", "#saveParentMod", function() {
        let updateItemId = null;
        let currentPriority = $('.parentMod').length + 1;

        $(this).text("Saving");
        $(this).attr("disabled", true);

        $("#newParentModForm").ajaxSubmit({
            type: "POST",
            url: "/Admin/SaveParentMod",
            data: {
                priority: currentPriority
            },
            success: function(response) {
                if (response.code == 200) {
                    $(".close").click();
                }

                location.reload();

                $(this).text("Save");
                $(this).removeAttr("disabled");
            }.bind($(this))
        });
    });

    $(document).on("click", ".addNewSubMob", function(e) {
        if (e.target.classList.contains("savePriorityList") || e.target.classList.contains("deleteParentMod"))
            return;
        parentModRef = $(this);
        $('#saveParentMod').hide();
        $('#saveNewSubMod').show();
        $(".openSubModModal").click();
        $('#newSubModForm').show();
        $('#newParentModForm').hide();
        $(".newSubModForm input").val("");
    });

    $(document).on("click", ".editSubNavItem", function(e) {
        parentModRef = $(this);
        $('#saveParentMod').hide();
        $('#saveNewSubMod').show();
        editSubNavItem = allControllersData.find(x => x.id == $(this).attr('item-id'));
        $(".openSubModModal").click();
        $('#newSubModForm').show();
        $('#newParentModForm').hide();
        $("[name='module_name']").val(editSubNavItem.sub_module ? editSubNavItem.sub_module : editSubNavItem.made_up_name);
        $("[name='route']").val(editSubNavItem.controller);
        $("[name='made_up_name']").val(editSubNavItem.made_up_name);
        $("[name='show_in_sub_menu']").val(editSubNavItem.show_in_sub_menu);

        setTimeout(() => {
            $("[name='module_name']").focus();
            $("[name='route']").focus();
            $("[name='made_up_name']").focus();
        }, 500);
    });

    $(document).on("click", ".addNewParentMod", function(e) {
        $(".openSubModModal").click();
        $('#exampleModalLabel').text('Parent Module Settings');
        $('#newSubModForm').hide();
        $('#newParentModForm').show();

        $('[name="parent_op"]').val('add');

        $('[name="parent_module_name_update"]').remove();

        $(".newParentModForm input").val("");
        $('#saveParentMod').show();
        $('#saveNewSubMod').hide();
    });

    $(document).on("click", ".saveParentPriorityList", function(e) {
        let priorityList = [];
        let priority = 1;
        $('.parentMod').each(function() {
            priorityList.push({
                module: $(this).attr('value'),
                priority: priority++
            });
        });
        $(this).text('Saving..')
        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateParentModPriority',
            data: {
                _token: $('input[name="_token"]').val(),
                data: priorityList
            },
            success: function(response) {
                location.reload();
            }
        })
    });
}

function navItemsScript() {
    const parentModules = [
        ...new Set(
            allControllersData
            .filter(x => x.show_in_sidebar == 1)
            .map(item => item.parent_module)
        )
    ];
    currentPageRight = false;
    let childModules = null;
    $("#parentModulesUl").empty();
    subNavItems.push({
        parent: "search",
        child: []
    });
    $("#parentModulesUl").append(
        `<li> <a data-toggle="modal" data-target="#SearchDiv" class="open_search_modal"><img src="/images/search-icon.svg" alt="" /> Search</a> </li>`
    );
    subNavItems.push({
        parent: "Create New",
        child: [
            '<li><a><img src="images/task-icon.svg" alt="" />Task</a> </li>',
            '<li> <a href="/OrderManagement"><img src="images/order-icon.svg" alt="" />Order</a> </li>',
            '<li> <a href="/register"><img src="images/emp-icon.svg" alt="" />Employee</a> </li>',
            '<li> <a href="/Customer"><img src="images/customer-icon.svg" alt="" />Customer</a> </li>',
            '<li> <a href="/AddProduct"><img src="images/product-icon.svg" alt="" />Product</a> </li>',
            '<li> <a href="/Shipping"><img src="images/shippers-icon.svg" alt="" />Shippers</a> </li>',
            '<li> <a href="/Suppliers"><img src="images/supplier-icon.svg" alt="" />Supplier</a> </li>',
            '<li> <a><img src="images/payment-icon.svg" alt="" />Payment</a> </li>',
            '<li> <a href="/Orders"><img src="images/invoice-icon.svg" alt="" />Invoices</a> </li>'
        ]
    });
    $("#parentModulesUl").append(
        `<li> <a attr-name="Create New" class="openSubMenu"><img src="/images/add-pluse-icon.svg" alt="" /> Create New</a> </li>`
    );
    $("#parentModulesUl").append(
        `<li> <a href="/"><img src="/images/dashboard-icon.svg" alt="" /> Dashboard</a> </li><hr>`
    );

    parentModules.forEach((element, index) => {
        let childMods = {
            parent: "",
            child: []
        };
        childModules = allControllersData.filter(
            x => x.parent_module == element
        );
        if (childModules.length)
            childModules.sort(
                (a, b) => a.sub_module_priority - b.sub_module_priority
            );

        let anyChildRight = false;

        childModules.forEach(child => {
            if (rightsGiven.includes(child.controller) && child.show_in_sub_menu) {
                childMods.child.push(
                    `<li> <a href="/${
                        child.controller
                    }"><img src="/storage/icons/${child.sub_menu_icon}" alt="" />${
                        child.sub_module ? child.sub_module : child.made_up_name
                    }</a> </li>`
                );
                anyChildRight = true;
            }
        });

        if (!anyChildRight) return;

        if (
            rightsGiven.includes(currentSegment) ||
            currentSegment == "home" ||
            currentSegment == "/"
        ) {
            currentPageRight = true;
        }

        childMods.parent = element;
        subNavItems.push(childMods);
        if (element !== "Dashboard")
            $("#parentModulesUl").append(
                `<li> <a attr-name="${element}" class="openSubMenu"><img src="/storage/icons/${childModules[0].logo}" alt="" /> ${element}</a> </li>`
            );
    });

    if (currentPageRight) {
        renderPage();
    } else {
        $(".close").remove();
        $(".modal-title").text("403 Forbidden");
        $("#wrapper").addClass("blur-div");
        $(".modal").css("pointer-events", "none");
        $(".modal-header").css("justify-content", "center");
        $("#assignmendModalContent").html(
            `<div style="text-align: center">You are not authorized to view this page. Please click here to go to <a href="/home">home</a></div>`
        );
        $(".notAllowedError").click();
        return;
    }
}

function openSidebar(element = "#product-cl-sec") {
    $(element).addClass("active");
    $(".overlay").addClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
    $("body").toggleClass("no-scroll");
    $("#contentContainerDiv").addClass("blur-div");
    $(".sticky-footer").addClass("blur-div");
    $(".overlay-for-sidebar").css("display", "block");
}

function closeSidebar() {
    $("#product-cl-sec").removeClass("active");
    $("#product-add").removeClass("active");
    $("#performaPreferences").removeClass("active");
    $(".overlay").removeClass("active");
    $("body").toggleClass("no-scroll");
    $("#contentContainerDiv").removeClass("blur-div");
    $(".sticky-footer").removeClass("blur-div");
    $(".overlay-for-sidebar").css("display", "none");
}

function openSubNav() {
    $("#_subNav-id").addClass("active");
    $("#content-wrapper").addClass("blur-div");
    $("body").addClass("no-scroll");
}

function closeSubNav() {
    $("#_subNav-id").removeClass("active");
    $("#content-wrapper").removeClass("blur-div");
    $("body").removeClass("no-scroll");
}

function fetchSiteSearchReasult(str){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/GetSiteSearchResult/'+str,
            success: function(response) {
                $('.SearchList').empty();
                $('#tblLoader_search').hide();
                var response = JSON.parse(response);
                var counter = 0;
                $.map(response.data, function(v, i){
                    if(v.length > 0){
                        $('.SearchList').append(`<ul id="${counter}"><h3>${i}</h3></ul>`);
                        v.map(function(x){
                            $(`#${counter}`).append(`<li><a href="${(i == 'Customers' ? `/CustomerProfile/${x.id}` : (i == 'Products' ? `/BrandProducts/${x.id}`: (i == 'Orders' ? `/OrderManagement`: (i == 'Shippers' ? `/Shipping` : (i == 'Suppliers' ? `/Suppliers`: (i == 'Forwarders' ? `/forwarder` : ``))))))}"><img src="images/access-right-icon.svg" alt=""> ${(i == 'Customers' ? `${x.company_name}` : (i == 'Products' ? `${x.name}`: (i == 'Orders' ? `${x.invoice_num}`: '')))}</a></li>`);
                        });
                    }
                    counter ++;
                });
            }
        });
    })
}

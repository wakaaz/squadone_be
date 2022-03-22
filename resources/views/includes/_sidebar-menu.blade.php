<ul class="sidebar navbar-nav toggled sidebar-navigation">
    @if(in_array("HomeController", $userPermissions))
    <li class="nav-item">
        <a class="nav-link" href="/">
            <img src="/images/icon-dash-board.svg" alt="" />
            <span>Dashboard</span>
        </a>
    </li>
    @endif
    @if(in_array("register", $userPermissions) || in_array("AccessRights", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-l1" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/icon-organization.svg" alt="" />
            <span>Organization</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l1">
            @if(in_array("register", $userPermissions))
            <a class="dropdown-item" href="/register">Employees List</a>
            @endif
            @if(in_array("AccessRights", $userPermissions))
            <a class="dropdown-item" href="/AccessRights">Access Rights</a>
            @endif
        </div>
    </li>
    @endif
    @if(in_array("Customer", $userPermissions) || in_array("CustomerTypes", $userPermissions) ||
    in_array("ProspectCustomers", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-l1" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/icon-customer-management.svg" alt="" />
            <span>Customer Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l1">
            @if(in_array("Customer", $userPermissions))
            <a class="dropdown-item" href="/Customer">Customer List</a>
            @endif
            @if(in_array("CustomerTypes", $userPermissions))
            <a class="dropdown-item" href="/CustomerTypes">Customer Types</a>
            @endif
            @if(in_array("DocumentTypes", $userPermissions))
            <a class="dropdown-item" href="/DocumentTypes">Document Types</a>
            @endif
            @if(in_array("ProspectCustomers", $userPermissions))
            <a class="dropdown-item" href="/ProspectCustomers">Prospects List</a>
            @endif
        </div>
    </li>
    @endif
    @if(in_array("Products", $userPermissions) || in_array("Units", $userPermissions) || in_array("Variants",
    $userPermissions) || in_array("Gallery", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-l2" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/icon-inv.svg" alt="" />
            <span>Product Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l2">
            @if(in_array("AddProduct", $userPermissions))
            <a class="dropdown-item" href="/AddProduct">Add Product</a>
            @endif
            @if(in_array("Products", $userPermissions))
            <a class="dropdown-item" href="/BrandProducts">Products List</a>
            @endif
            @if(in_array("Units", $userPermissions))
            <a class="dropdown-item" href="/Units">Units</a>
            @endif
            @if(in_array("Variants", $userPermissions))
            <a class="dropdown-item" href="/Variants">Variants</a>
            @endif
            @if(in_array("Categories", $userPermissions))
            <a class="dropdown-item" href="/Categories">Main Categories</a>
            <a class="dropdown-item" href="/SubCategories">Sub Categories</a>
            @endif
            @if(in_array("Gallery", $userPermissions))
            <a class="dropdown-item" href="/Gallery">Gallery</a>
            @endif
            @if(in_array("upload_bluk", $userPermissions))
            <a class="dropdown-item" href="/upload_bluk">Upload Bulk</a>
            @endif
        </div>
    </li>
    @endif
    @if(in_array("Shipping", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-l1" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/icon-shipping.svg" alt="" />
            <span>Shippers Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l1">
            <a class="dropdown-item" href="/Shipping">Shipping Companies</a>
            <a class="dropdown-item" href="/Ports">Delivery Ports</a>
        </div>
    </li>
    @endif
    @if(in_array("Suppliers", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-l3" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/supplier.svg" alt="" />
            <span>Supplier Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l3">
            @if(in_array("Suppliers", $userPermissions))
            <a class="dropdown-item" href="/Suppliers">Suppliers List</a>
            <a class="dropdown-item" href="/SupplierProductAssignment">Suppliers Product Assignment</a>
            @endif
        </div>
    </li>
    @endif
    @if(in_array("Notifications", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-17" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/notifications.svg" alt="" />
            <span>Notification Center</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l7">
            <a class="dropdown-item" href="/Notifications">Notification Prefrences</a>
        </div>
    </li>
    @endif
    @if(in_array("Orders", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-17" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/invoice.svg" alt="" />
            <span>Invoice Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l7">
            <a class="dropdown-item" href="/Orders">Orders List</a>
        </div>
    </li>
    @endif
    @if(in_array("OrderManagement", $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-17" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/invoice.svg" alt="" />
            <span>Order Management</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l7">
            <a class="dropdown-item" href="/OrderManagement">Orders List</a>
        </div>
    </li>
    @endif
    @if(in_array("Correspondence", $userPermissions) || in_array("Mediums", $userPermissions) || in_array("Stages",
    $userPermissions))
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navi-17" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img src="/images/invoice.svg" alt="" />
            <span>Correspondence</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navi-l7">
            @if(in_array("Stages", $userPermissions))
            <a class="dropdown-item" href="/Stages">Stages</a>
            @endif
            @if(in_array("Mediums", $userPermissions))
            <a class="dropdown-item" href="/Mediums">Mediums</a>
            @endif
            @if(in_array("Correspondence", $userPermissions))
            <a class="dropdown-item" href="/Correspondence">Correspondence</a>
            @endif
        </div>
    </li>
    @endif
</ul>

<div class="modal fade newSubModModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Sub Module Settings</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body PT-0">
                <div id="floating-label">
                    <form id="newParentModForm" enctype="multipart/form-data">
                        @csrf
                        <input name="parent_op" hidden />
                        <div class="form-wrap _w90 PT-10 PB-10" style="width: 100%;">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Parent Module Name*</label>
                                        <input type="text" name="parent_module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sidebar*</label>
                                        <select class="form-control" name="show_in_sidebar">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Parent Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="parent_icon" id="icon" class="dropify"
                                            accept="image/*" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Sub Module Name*</label>
                                        <input type="text" name="module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Route*</label>
                                        <input type="text" name="route" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Made Up Name*</label>
                                        <input type="text" name="made_up_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sub-menu*</label>
                                        <select class="form-control" name="show_in_sub_menu">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="icon" id="icon" class="dropify" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form id="newSubModForm" enctype="multipart/form-data">
                        @csrf
                        <div class="form-wrap _w90 PT-10 PB-10" style="width: 100%;">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Module Name*</label>
                                        <input type="text" name="module_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Route*</label>
                                        <input type="text" name="route" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Made Up Name*</label>
                                        <input type="text" name="made_up_name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label mb-10">Show in sub-menu*</label>
                                        <select class="form-control" name="show_in_sub_menu">
                                            <option value="1" selected>Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="pt-19">
                                        <label class="font12">Icon*</label>
                                        <div class="upload-pic"></div>
                                        <input type="file" name="icon" id="icon" class="dropify" accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="font-size: 12px; font-weight: normal"
                    data-dismiss="modal">Close</button>
                <button type="button" id="saveNewSubMod" class="btn btn-primary"
                    style="font-size: 12px; font-weight: normal">Save</button>
                <button type="button" id="saveParentMod" class="btn btn-primary"
                    style="font-size: 12px; font-weight: normal">Save</button>
            </div>
        </div>
    </div>
</div>
<button style="display:none" class="openSubModModal" data-toggle="modal" data-target=".newSubModModal"></button>
<div class="modal fade" id="docsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Documents</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="font-size: 12px; font-weight: normal"
                    data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" style="font-size: 12px; font-weight: normal">Save
                    changes</button>
            </div>
        </div>
    </div>
</div> 
<button style="display:none" class="open_confirmation_modal" data-toggle="modal"
    data-target=".db-confirmation-modal"></button>

<div class="modal fade" id="SearchDiv" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-full" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row SearchTopHead">
                        <div class="col-6">
                            <h2 class="_head01 mb-0">Search</h2>
                        </div>
                        <div class="col-6">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                    </div>
                    <div class="row Search__Input">
                        <input type="search" class="form-control search_whole_site" placeholder="Type to search...">
                        <a href="#"><img src="/images/search-icon.svg" alt="" /></a>
                    </div>
                </div>
                <div style="min-height: 400px" id="tblLoader_search" style="display:none">
                    <img src="/images/loader.gif" width="30px" height="auto"
                        style="position: absolute; left: 50%; top: 45%;">
                </div>
                <div class="container-fluid SearchList">
                    <ul>
                        <h3>Notes</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design Call to new
                                clients</a>
                        </li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Email to
                                Ali
                                TraderEmail to Ali Traders Email to Ali Trader</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Task</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Call to
                                new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design Make Web Design
                                Make Web
                                Design Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Order</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients Call to new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders Call to
                                new
                                clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Payment</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali TradersCall to new
                                clients
                            </a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web DesignMake Web
                                Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                    </ul>

                    <ul>
                        <h3>Recently Modified</h3>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Email to Ali Traders</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Make Web Design</a></li>
                        <li><a href="#"><img src="/images/access-right-icon.svg" alt=""> Call to new clients</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div> 

{{-- Delete Confirmation Modal --}}
<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content top-borderRed">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="col-md-12">
                    <p>Are you sure you want to delete?</p>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-primary confirm_delete">Yes</button>
                <button type="button" class="btn btn-cancel cancel_delete_modal" data-dismiss="modal"
                    aria-label="Close">No</button>
            </div>
        </div>
    </div>
    <button hidden data-toggle="modal" data-target="#deleteModal" id="hidden_btn_to_open_modal"></button>
</div>
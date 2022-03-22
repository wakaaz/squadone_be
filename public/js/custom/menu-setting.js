function MenuSetting(){
    this.data = null;
    this.counter = 1;
    this.menu = [];
}

MenuSetting.prototype.http = function(type, url, formData){
    var self = this;
    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            url: url,
            type: type,
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(e){
                resolve(e);
            },
            error: function(err) {
                if (err.status == 422 || err.status == 500) {
                    self.notification('error', 'Some Error Occured, please try again.');
                }

                self.loader('hide');
            }
        });
    });
}

MenuSetting.prototype.notification = function(type, message){
    var bgColor = (type=='error')? 'red' : 'green' ;
    var el = $('#notifDiv');
    el.fadeIn();
    el.css('background', bgColor);
    el.text (message);
    setTimeout(() => {
        el.fadeOut();
    }, 3000);
}

MenuSetting.prototype.loader = function(action){
    if(action=='show'){
        $('.tblLoader').show();
        $('.card').hide();
    }else if(action=='hide'){
        $('.tblLoader').hide();
        $('.card').show();
    }
}

MenuSetting.prototype.init = function(){
    var self = this;
    this.http('GET', 'get-menu-setting-data').then((e)=>{
        self.data = JSON.parse(e);
        self.setData();
    });
}

MenuSetting.prototype.setData = function(){
    this.data.modules.forEach((module, key) => {
        $('#filters-area').append(`<div class="col-auto pr-400">
            <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" name="filter_id" id="filter${key}" value="${module.type}" onchange="SelectFilter($(this).val())">
                <label class="custom-control-label font13 pt-1" for="filter${key}">${module.name}</label>
            </div>
        </div>`);
    });
}

var menusetting = new MenuSetting();
menusetting.init();

function SelectFilter(type){
    $('#Module').html('');
    var module = menusetting.data.modules.find(x=>x.type==type);
    moduleData = menusetting.data.result[module.type];
    moduleData.forEach(element => {
        $('#Module').append(`<option value="${element.slug}" type="${type}">${element.name}</option>`);
    });
    $('#Module').select2().trigger('change');
}

function AddMenu(){
    var slug = $('#Module').val();
    var type = $("#Module option:selected").attr("type")
    console.log(slug, type);
    var module = menusetting.data.modules.find(x=>x.type==type);
    moduleData = menusetting.data.result[module.type];
    var r = moduleData.find(x=>x.slug==slug);

    // console.log(r);
    // var moduleData = menusetting.data.modules.find(x=>x.type==type);
    var menu = {id:menusetting.counter, name:r.name, url:r.url, slug:slug, type:type, target:'_self', data:[]};

    $('#sortable').append(`<div class="sortable-moves" id="MainMenuBar${menu.counter}">
        <div class="col-12">
            <div class="PackagingOption mb-0">
                <div class="row">
                    <div class="col-8 pr-0" style="line-height:2">${menu.name}</div>
                    <div class="col-3" style="padding-top:5px">
                        <div class="custom-control custom-checkbox mr-sm-2 PageCheckbox font13">
                            <input type="checkbox" name="0001" class="custom-control-input" value="1" id="0001" checked="">
                            <label class="custom-control-label" for="0001">New Window?&nbsp;</label>
                        </div>
                    </div>
                    <div class="col-auto position-relative">
                        <button type="button" class="btn delListPO" title="Delete"><i class="fa fa-trash-alt"></i></button>
                        <button type="button" class="btn editListPO" data-toggle="collapse" data-target="#collapsePOCdetail${menu.counter}" aria-expanded="false" aria-controls="collapsePOCdetail${menu.counter}" title=""><i class="fa fa-angle-down"></i></button>
                    </div>
                </div>
            </div>
            <div class="collapse" id="collapsePOCdetail${menu.counter}">
                <div class="addPackagingOption">
                    <div class="row">
                        <div class="col-12 position-relative">
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <input type="text" class="form-control input-style" placeholder="Add Title">
                                    </div>
                                </div>
                                <div class="col-auto"><button type="button" class="btn btn-primary add-deal-sec mt-0">Add Submenu</button></div>
                            </div>
                        </div>
                        <div class="subsortable" id="subsortable${menu.counter}">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`);
    menusetting.menu.push(menu);
    menusetting.counter = menusetting.counter+1;
}


$( "#sortable" ).sortable({
    connectWith: "#sortable",
    handle: ".PackagingOption",
    start: function(){ $('.collapse').collapse('hide'); },
    stop: function(){  }
});

$( ".subsortable" ).sortable({
    connectWith: ".subsortable",
    handle: ".SubPackagingOption",
    // start: function(){ $('.collapse1').collapse('hide'); },
    // stop: function(){  }
});

$( ".sub2sortable" ).sortable({
    connectWith: ".sub2sortable",
    handle: ".Sub2PackagingOption",
    // start: function(){ $('.collapse1').collapse('hide'); },
    // stop: function(){  }
});

//   $( function() {
//     $( ".column" ).sortable({
//       connectWith: ".column",
//       handle: ".portlet-header",
//       cancel: ".portlet-toggle",
//       placeholder: "portlet-placeholder ui-corner-all"
//     });

//     $( ".portlet" )
//       .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
//       .find( ".portlet-header" )
//         .addClass( "ui-widget-header ui-corner-all" )
//         .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

//     $( ".portlet-toggle" ).on( "click", function() {
//       var icon = $( this );
//       icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
//       icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
//     });
//   } );



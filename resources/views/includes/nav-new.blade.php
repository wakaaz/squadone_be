

<div class="sidebarblue" id="sidebarblue">
    <div class="aside-primary">
        <div class="sell360">
            <a href="/"><img alt="Sell360" src="/images/logo-w.svg"></a>
        </div>
        <div class="main-links">
            <ul id="parentModulesUl">
            </ul>
        </div>
        <div class="_user-nav">
            <a href="#"><img src="/images/bell-icon-2.svg" alt="Notification" title="Notification" /><span
                    class="badge">{{ sizeof($notif_data) }}</span></a>
            <a href="/Profile/{{ Auth::user()->id }}" class="userIMG"><img
                    src="{{ Auth::user()->picture ? str_replace('./', '/', Auth::user()->picture) : '/images/avatar.svg' }}"
                    alt="" /></a>
            <a href="/manage_settings" class="float-right"><img src="/images/setting-icon.svg" alt="Setting"
                    title="Setting" /></a>
        </div>
        <div class="sidebar-BL">
            <ul>
                {{-- <li>
                    <a href="/Tasks"><img src="/images/task-icon.svg" alt="" /> Tasks <span
                            class="badge">00</span></a>
                </li> --}}
                <li>
                    <a href="/logout"><img src="/images/logout-icon.svg" alt="Employee" /> Logout</a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div id="_subNav-id">
    <div class="_subNav"> <a id="SN-close" class="SN-close-btn"><i class="fa fa-arrow-left snCloseBtn"></i></a>
        <h2 id="subNavHeader"></h2>
        <ul id="subNavItems">
        </ul>
    </div>
</div>

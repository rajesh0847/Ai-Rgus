// <editor-fold defaultstate="collapsed" desc=" class : iGU_iModal ">
class _iGU_iModal {
    /*
     * CSS for the X button, search for: .modal-dialog .btn-close
     */

    constructor(a) {
        let defaults = {
            m_skele: 0,
            m_html: '',
        }; // do NOT include keyword var ;  you want to access defaults inside the $.each()
        this.a = $.extend(true, {}, defaults, a);

        //        if(this["a"]["m_skele"] === 0){
        //            this["a"]["m_skele"] = bootstrap.Tooltip.VERSION < '5.0.0'? 1 : 2;
        //        }

        //        if(this["a"]["m_skele"] === 1){
        //          this["a"]["m_html"] =
        //            ['<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="bannerformmodal" aria-hidden="true">',
        //            '    <div class="modal-dialog modal-notify" role="document">',
        //            '      <div class="modal-content">',
        //            '        <div class="modal-header">',
        //            '            <div class="h3 row modal-title fw-bold align-items-center h-100" id="bannerformmodal">',
        //            '                <div class="col-auto t_icon pe-0"></div>',
        //            '                <div class="col t_text ps-0"></div>',
        //            '            </div>',
        //            '            <button type="button" class="close" data-dismiss="modal" aria-label="Close">',
        //            '                <span aria-hidden="true">&times;</span>',
        //            '            </button>',
        //            '        </div>',
        //            '        <div class="modal-body"></div>',
        //            '        <div class="modal-footer">',
        //            '          <button type="button" class="btn-yes btn btn-primary btn-primary-01"></button>',
        //            '          <button type="button" class="btn-no btn btn-info btn-info-01 d-none"></button>',
        //            '        </div>',
        //            '      </div>',
        //            '    </div>',
        //            '</div>'].join('');
        //        } else {
        //            ['<div class="modal fade" tabindex="-1" aria-labelledby="bannerformmodal" aria-hidden="true">',
        this['a']['m_html'] = [
            '<div class="modal fade" tabindex="-1">',
            '    <div class="modal-dialog _modal-notify" _role="document">',
            '      <div class="modal-content">',
            '        <div class="modal-header">',
            '            <div id="bannerformmodal" class="row h3 modal-title fw-bold align-items-center h-100">',
            '                <div class="col-auto t_icon pe-0"></div>',
            '                <div class="col t_text ps-0"></div>',
            '            </div>',
            '            <button type="button" class="btn-close border shadow" data-bs-dismiss="modal" aria-label="Close"></button>',
            '        </div>',
            '        <div class="modal-body"></div>',
            '        <div class="modal-footer">',
            '          <button type="button" class="btn-yes btn js-iRipple btn-primary btn-primary-01"></button>',
            '          <button type="button" class="btn-no btn js-iRipple btn-info btn-info-01 d-none"></button>',
            '        </div>',
            '      </div>',
            '    </div>',
            '</div>',
        ].join('');
        //        }
        //        $("body").append(this["a"]["m_html"]);
    }

    /* for wider modals
    "fun_beforeShow" : function(calling_el, _modal){
            $(".modal-dialog", _modal).addClass("modal-xl");
    }
    */

    modal_manager(a) {
        let _that = this;

        let defaults = {
            // do NOT include keyword var ;  you want to access defaults inside the $.each()
            calling_el: '', // neccessary? add it once you call this function calling_el : $(this)
            m_for: '', // [w: warning | d: danger | i: Information]
            autoShow: true,
            t_icon: '<i class="fas fa-plus fa-lg text-dark"></i>',
            t_text: 'ABCDD',
            b_text: 'abcd1234',
            m_centered: false, // the possition of the modal on the page
            staticBackdrop: false, // When backdrop is set to static, the modal will not close when clicking outside it
            btn_y_txt: 'Confirm',
            btn_n_txt: 'Dismiss',
            btn_y: true,
            btn_n: true,
            btn_x: true,
            btn_y_dismiss: true, // dismiss / close dialog after clicking NO
            btn_n_dismiss: true, // dismiss / close dialog after clicking NO
            modal_t_css: '', // toggle class
            modalCont_css: {}, // css setings  like;  {"width": Math.min(screen.width-10 , 600) + "px"}
            m_winSize: {}, // as % of the screen size {"w": 90}
            fun_beforeShow: function (calling_el, _modal) {},
            fun_afterShow: function (e, calling_el) {}, // let modal = e.target;
            fun_onClickYes: function (e, calling_el) {},
            fun_onClickNo: function (e, calling_el) {},
            fun_AfterHide: function (e, calling_el) {},
            fun_AfterHidden: function (e, calling_el) {},
        };
        a = $.extend(true, {}, defaults, a);

        var _modal = $(this['a']['m_html']);
        $('body').append(_modal);

        setTimeout(() => {
            $('.tooltip, .popover').remove();
        }, 250);

        _modal.find('.modal-dialog').toggleClass(a.modal_t_css);
        _modal.find('.modal-content').css(a['modalCont_css']);
        if (a.m_centered) {
            _modal.find('.modal-dialog').addClass('modal-dialog-centered');
        }
        if (!a.btn_x) {
            _modal.find('.close').addClass('d-none');
        }
        if (!a.btn_y) {
            _modal.find('.btn-yes').addClass('d-none');
        }
        if (a.btn_n) {
            _modal.find('.btn-no').removeClass('d-none');
        }
        if (a.btn_n_dismiss) {
            let dName = _that['a']['m_skele'] == 1 ? 'data-dismiss' : 'data-bs-dismiss';
            _modal.find('.btn-no').attr(dName, 'modal');
        }
        if (a.btn_y_dismiss) {
            let dName = _that['a']['m_skele'] == 1 ? 'data-dismiss' : 'data-bs-dismiss';
            _modal.find('.btn-yes').attr(dName, 'modal');
        }
        if (a.staticBackdrop) {
            _modal.modal({ backdrop: 'static', keyboard: false });
        }

        _modal.find('.t_icon').html(a.t_icon);
        _modal.find('.t_text').html(a.t_text);
        _modal.find('.modal-body').html(a.b_text);
        _modal.find('.btn-yes').html(a.btn_y_txt);
        _modal.find('.btn-no').html(a.btn_n_txt);

        switch (a.m_for) {
            case 'w':
                _modal.find('.modal-dialog').addClass('modal-warning'); // mdb
                _modal.find('.modal-header').addClass('bg-warning'); // bootstrap
                break;
            case 'd':
                _modal.find('.modal-dialog').addClass('modal-danger'); // mdb
                _modal.find('.modal-header').addClass('bg-danger'); // bootstrap
                _modal.find('.modal-header , .close').addClass('text-white');
                break;
            case 'i':
                _modal.find('.modal-dialog').addClass('modal-info'); // mdb
                _modal.find('.modal-header').addClass('bg-primary'); // bootstrap
                _modal.find('.modal-header , .close').addClass('text-white');
                break;
        }

        a.fun_beforeShow(a.calling_el, _modal);
        if (a.autoShow) {
            _modal.modal('show');
        }
        
        _modal.on('shown.bs.modal', function (e) {
            if (a['m_winSize']['w'] !== undefined) {
                let m_w = (window.innerWidth * a['m_winSize']['w']) / 100;
                let w_w = window.innerWidth;
                $('.modal-content')
                    .width(m_w)
                    .css('left', -(m_w / 2) + w_w - m_w);
                $('.modal-content', _modal)
                    .width(m_w)
                    .css('left', -(m_w / 2) + w_w - m_w);
            }

            // new iPageLogos();
            a.fun_afterShow(e, a.calling_el);
        });

        $('.btn-yes', _modal).on('click', function (e) {
            a.fun_onClickYes(e, a.calling_el);
        });
        $('.btn-no', _modal).on('click', function (e) {
            a.fun_onClickNo(e, a.calling_el);
        });

        _modal.on('hide.bs.modal', function (e) {
            a.fun_AfterHide(e, a.calling_el);
        });
        _modal.on('hidden.bs.modal', function (e) {
            _modal.remove();
            a.fun_AfterHidden(e, a.calling_el);
        });
    }
}
// </editor-fold>

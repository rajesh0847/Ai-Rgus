_iGUiModal.modal_manager({
    m_for: 'w',
    t_icon: '<i class="fas fa-exclamation-triangle fa-lg text-dark ms-2 pe-3"></i>',
    t_text: `<div class='ps-1' style='line-height: 30px;'>${infos.text.charAt(0).toUpperCase() + infos.text.slice(1)} update</div>`,
    b_text: bText,
    btn_y_txt: 'Change',
    btn_y_dismiss: false,
    btn_n_txt: 'Cancel',
    staticBackdrop: true,
    modal_t_css: 'modal-lg',
    modalCont_css: { height: '700px' },
    fun_beforeShow: function (calling_el, _modal) {
        const dropdown = createDropdownForTable(
            {
                dd_moveToBody: false,
                dd_calling_btn: { text: `Select a ${infos.text}`, title: `Select a ${infos.text}`, width: 250 },
                dd_select_list: { id: 'btn_selectDropdown', _alwaysShow: true },
                iTr_data: { ajaxURL: null, class_name: null },
                //  +IR+ we need to test if AJAX will work
                iTr_ddList: { type: 'button' },
                iTr_field_name: 'txt',
                iTr_table_index: 'txt',
                fn_onDropdownClick: (row, selectedRows, table, dropdown) => {
                    // handleCheckboxChange(row, selectedRows, table, dropdown, filterIndex, dropdownId, type);
                    const filterBtnText = $('#dropdownMenuButton', dropdown);
                    filterBtnText.text(row.getData()['txt']);
                    //                        $(`.iDDselnWfilter_btn`, dropdown).removeClass('fw-bold');

                    // -- customized for this function --
                    $(`.iDDselnWfilter_btn`, dropdown).removeClass('is-invalid');
                    $(`.iDDselnWfilter_btn`, dropdown).addClass('fw-bold');
                    //                    $(`#${id}`).attr(listItem.attr || {});  // Adding extra attributes that we have from the selected option (exist in Template name)
                },
                fn_beforeDropdownShow: (e, table) => {
                    //                    getDropDownData(dropdownId);
                    //                    if (table) {
                    //                        table.refreshFilter();
                    //                    }
                },
                //                iTR_filter: [
                //                    {
                //                        field: 'visible',
                //                        type: '=',
                //                        value: true,
                //                    },
                //                ],
                //                closeOtherDropdown: true,
                //                dd_moveToBody: true
            },
            infos.dd_selectlist
        );

        $('.modal-body', _modal).append(dropdown.dropdown);
        $('#btn_selectDropdown', _modal).attr('ins_val', $('#btn_selectDropdown').text());
    },
    fun_afterShow: function (e, calling_el) {
        let modal = e.target;
        //            $(".dropdown-toggle", modal).click();
        //            $(".dropdown-menu .filterByValue input", modal).focus();
    },
    fun_onClickYes: function (e, calling_el) {},
});

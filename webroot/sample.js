// <editor-fold defaultstate="collapsed" desc=" fn: createDropdownForTable ">
//#region - fn: createDropdownForTable
function createDropdownForTable(ops = {}) {
    let def = {
        dd_el_w: {
            class: 'dd_filter_byTr_callingEl dropdown btn-group me-2',
            style: 'solid 0.01px #dfdddd',
            //             icon: {class: null, style: null}, alt_el: null
        }, // The button we click to activate the dropdown

        dd_moveToBody: false,
        dd_calling_btn: {
            class: 'btn border-0 dropdown-toggle py-1 [ position-relative text-nowrap-elpsis ]',
            style: null,
            text: null,
            title: null,
        }, // the element opened once we
        dd_select_list: { id: null, class: 'dropdown-menu tabulator-dd dds_itemsList_w', style: null },
        iTr_data: { data: {}, ajaxURL: null, class_name: null, style_name: null }, //  not clear if and when we use them class_name, style_name
        //  +IR+ we need to test if AJAX will work
        iTr_table_index: 'id',
        iTr_height: 350,
        iTr_width: 199,
        iTR_filter: [],
        iTr_field_name: '',
        iTr_field_headerSearchPlaceHolder: 'Search',
        iTr_field_padding: { padding: '10px' },
        iTr_field_attrs: '', // this is the name of the attributes stored in the table data
        iTr_field: {
            class: 'w-100 text-start border-1 bg-white',
            style: '',
            hover_in: { 'background-color': '#bbb' },
            hover_out: { 'background-color': '#fff' },
        }, // +IR+ in case I need it border: '1px solid rgba(0, 0, 0, 0.2)',
        iTr_ddList: { type: 'button', css: { 'margin-right': '5px' } }, // [ button | multi-checkbox | checkbox ]
        iTr_add_tableOptions: {},
        fn_onDropdownClick: null,
        fn_beforeDropdownShow: null,
        shouldRefresh: false,
        closeOtherDropdown: true,

        /*
         * options.dropdown.className => dd_el_w.class
         * options.dropdown.text  => dd_calling_btn.text
         * options.dropdown.title => dd_calling_btn.title
         * options.dropdown.style => dd_calling_btn.style
         * options.dropdownOptions.dropdownMenuClass => dd_select_list.class
         * options.dropdown.dropdownId => dd_select_list.id
         * options.dropdownOptions.style => dd_select_list.style
         * options.data => iTr_data.data
         * options.dropdownOptions.style.height => iTr_height
         * options.dropdownOptions.filter => iTR_filter
         * options?.dropdownOptions?.dropdownField => iTr_field_name
         * options?.dropdownOptions?.searchPlaceHolder => iTr_field_headerSearchPlaceHolder
         * options.colSize => iTr_width
         * options.attributeKey => iTr_field_attrs
         * options?.dropdown?.type => iTr_ddList.type
         * options.classKey => iTr_data.class_name
         * options.styleKey => iTr_data.style_name
         * options.tableOptions => iTr_add_tableOptions
         * dropdownOptions.id => iTr_table_index
         * options?.dropdownOptions?.onDropdownClick => fn_onDropdownClick
         * options?.dropdown?.moveToBody => dd_moveToBody
         * options?.shouldRefresh => shouldRefresh
         * options.beforeDropdownShow => fn_beforeDropdownShow
         * options?.tableOptions?.ajaxURL => iTr_data.ajaxURL
         * options.closeOtherDropdown => closeOtherDropdown
         
         * 
         */
    };
    ops = $.extend(true, def, ops);

    // <editor-fold defaultstate="collapsed" desc=" fn: customHeaderFilter (Give teh ability to filter also inside the Tabulator nested data trees = the build in tree structure) ">
    //#region -fn: customHeaderFilter
    function customHeaderFilter(headerValue, rowValue, rowData, filterParams) {
        const parentValue = (rowData[filterParams?.filterKey] || '').toLowerCase();
        const searchValue = headerValue?.toLowerCase();

        function isValueExistInChildred(_children) {
            if (!_children) {
                return false;
            }
            return !!_children?.find((data) => (data?.[filterParams?.filterKey] || '').toLowerCase().includes(searchValue));
        }
        return parentValue.includes(searchValue) || isValueExistInChildred(rowData?._children); //must return a boolean, true if it passes the filter.
    }
    //#endregion
    // </editor-fold>

    let $dd_el_w = $('<div>').toggleClass(ops.dd_el_w.class).css(ops.dd_el_w.style);

    // +IR+ change id to be a class
    let $dd_calling_btn = $(`<button id="dropdownMenuButton" type="button" data-bs-toggle="dropdown" title="${ops.dd_calling_btn.title}">`)
        .toggleClass(ops.dd_calling_btn.class)
        .css(ops.dd_calling_btn.style)
        .text(ops.dd_calling_btn.text);

    // Create the dropdown menu UL element
    var $dd_select_list = $(`<ul id="${ops.dd_select_list.id}">`).toggleClass(ops.dd_select_list.class).css(ops.dd_select_list.style);

    // Append the button and menu to the dropdown div
    $dd_el_w.append($dd_calling_btn, $dd_select_list);
    // +IR+ I think we canreplace it with $dd_calling_btn
    const dropdownToggle = $('.dropdown-toggle', $($dd_el_w));

    let tableInstance;
    $dd_el_w.on('show.bs.dropdown', function () {
        if (!tableInstance) {
            // Only create the table if it doesn't already exist
            tableInstance = new Tabulator(`#${ops.dd_select_list.id}`, {
                virtualDom: true,
                dataLoaderLoading:
                    "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>Loading Data</div>",
                data: ops.iTr_data.data,
                dataTree: true,
                dataTreeChildField: '_children',
                dataTreeStartExpanded: true,
                layout: 'fitData',
                height: ops.iTr_height,
                initialFilter: ops.iTR_filter,
                columns: [
                    {
                        field: ops.iTr_field_name,
                        headerFilter: 'input',
                        sortable: false,
                        headerSort: false,
                        width: ops.iTr_width,
                        headerFilterPlaceholder: ops.iTr_field_headerSearchPlaceHolder,
                        headerFilterFunc: customHeaderFilter,
                        formatter: (cell) => {
                            return cell.getValue();
                        },
                        headerFilterFuncParams: { filterKey: ops.iTr_field_name },
                        editable: true,
                        resizable: false,
                    },
                ],
                rowFormatter: function (row) {
                    $('.tabulator-cell', row.getElement()).css(ops.iTr_field_padding);
                    if (row.getData()[ops.iTr_field_attrs]) {
                        $(row.getElement()).attr(row.getData()[ops.iTr_field_attrs]);
                    }

                    $(row.getElement())
                        .toggleClass(ops.iTr_field.class)
                        .css(ops.iTr_field.style)
                        .hover(
                            function () {
                                $(this).css(ops.iTr_field.hover_in);
                            },
                            function () {
                                $(this).css(ops.iTr_field.hover_out);
                            }
                        );

                    if (ops.iTr_ddList.type !== 'button') {
                        const checkbox = $("<input class='dd_check', type='checkbox' />")
                            .css(ops.iTr_ddList.css)
                            .on('click', function (e) {
                                checkbox.prop('checked', row.isSelected());
                            });
                        $('.tabulator-cell', row.getElement()).prepend(checkbox);
                    }
                    $(row.getElement()).attr('title', row.getData()[ops.iTr_field_name]);
                    if (ops.iTr_data.class_name && row?.getData?.()?.[ops.iTr_data.class_name]) {
                        $(row.getElement()).addClass(row.getData()[ops.iTr_data.class_name]);
                    }
                    if (ops.iTr_data.style_name && row?.getData?.()?.[ops.iTr_data.style_name]) {
                        $(row.getElement()).css(row.getData()[ops.iTr_data.style_name]);
                    }
                },
                ...ops.iTr_add_tableOptions,
            });

            tableInstance?.on('rowClick', function (e, row) {
                //console.log('e', row.getElement());
                e.stopPropagation();
                row.toggleSelect();
                if (ops.iTr_ddList.type === 'button' || ops.iTr_ddList.type === 'checkbox') {
                    $('.dd_check', row.getElement()).prop('checked', row.isSelected());
                    tableInstance.getSelectedRows().forEach((srow) => {
                        if (row.getData()[ops.iTr_table_index] !== srow.getData()[ops.iTr_table_index]) {
                            srow.deselect();
                        }
                        if (ops.iTr_ddList.type !== 'button') {
                            $('.dd_check', srow.getElement()).prop('checked', srow.isSelected());
                        }
                    });
                    bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                } else {
                    $('.dd_check', row.getElement()).prop('checked', row.isSelected());
                }
                if (ops.fn_onDropdownClick) {
                    ops.fn_onDropdownClick(row, tableInstance?.getSelectedRows(), tableInstance, $dd_el_w);
                }
            });
            tableInstance.on('tableBuilt', () => {
                $('.tabulator-header-filter input', $dd_el_w).addClass('form-control form-control-sm').focus();
                $(`#${ops.dd_select_list.id} .tabulator-tableholder`).css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                });
            });
            if (ops.dd_moveToBody) {
                $('ul.dropdown-menu', $dd_el_w).addClass('moved_ddown_to_body').appendTo('body');
            }
        } else if (ops.shouldRefresh) {
            tableInstance.setData(ops.iTr_data.ajaxURL || ops.iTr_data.data);
        }
        if (ops.fn_beforeDropdownShow) {
            ops.fn_beforeDropdownShow($dd_el_w, tableInstance);
        }

        if (ops.closeOtherDropdown) {
            // Clear selected rows in other dropdowns with active tables
            $('.tabulator-dd').each(function () {
                const otherDropdownId = $(this).attr('id');
                if (otherDropdownId !== ops.dd_select_list.id) {
                    const dropdownInstance = $(`#${otherDropdownId}`, $(this).parent());
                    if (dropdownInstance.length) {
                        dropdownInstance.removeClass('show');
                    }
                }
            });
        }

        setTimeout(() => {
            tableInstance?.getRows('active')[0]?.scrollTo();
            $('.tabulator-header-filter input', $dd_select_list).focus();
        }, 10);
    });

    $dd_select_list.on('keydown', function (e) {
        const items = $dd_select_list.find('.tabulator-row');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            let currentItem = items.filter('[data-current="true"]');
            let nextItem;

            if (e.key === 'ArrowDown') {
                nextItem = currentItem.length ? currentItem.next() : items.first();
            } else if (e.key === 'ArrowUp') {
                nextItem = currentItem.length ? currentItem.prev() : items.last();
            }

            if (nextItem && nextItem.length) {
                // Remove the data attribute from the previously hovered item
                currentItem.removeAttr('data-current').css('background-color', '#fff');

                // Apply the hover effect to the new item, set the data attribute, and scroll into view
                nextItem.attr('data-current', 'true').css('background-color', '#bbb');
                nextItem.get(0).scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        } else if (e.key === 'Enter') {
            let currentItem = items.filter('[data-current="true"]');
            if (currentItem?.length) {
                currentItem.click();
            }
        } else if ($(e.target).closest('.tabulator-header-filter')?.length) {
            let currentItem = items.filter('[data-current="true"]');
            currentItem.removeAttr('data-current').css('background-color', '#fff');
        }
    });

    function getTableInstance() {
        return tableInstance;
    }

    // Append the dropdown div to the body or desired container
    return { dropdown: $dd_el_w, getTableInstance };
}


"fun_beforeShow" : function(calling_el, _modal){
    const id = `btn_selectDropdown`;
    const dropdown = iGet_el_SelectDropdown({ 
        el_w:{
          class: "ms-5"  
        },
        calling_btn: {
            class: `form-control form-control-sm border py-1 bg-white text-start`,
            style: "width: 250px",
            _style: 'border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;',
            icon: { class: 'fa-line-columns fa-filter' },
            alt_el: $('<span>', {
                id: id,
                class: 'pe-2',
                html: `Select a ${infos.text}`,
                click: (e) => {
                    e.stopPropagation();
                },
            }),
            type: 'button',
            removeFontBold: true,
            click: (e, val, listItem) => {
                const filterBtnText = $(`#${id}`, dropdown);
                filterBtnText.text(e.val());
//                        $(`.iDDselnWfilter_btn`, dropdown).removeClass('fw-bold');

                // -- customized for this function --
                $(`.iDDselnWfilter_btn`, dropdown).removeClass("is-invalid");
                $(`.iDDselnWfilter_btn`, dropdown).addClass("fw-bold");
                $(`#${id}`).attr(listItem.attr || {});  // Adding extra attributes that we have from the selected option (exist in Template name)
            }
        },
        dd_element: { class: 'iTr_F_01 show' },
        // dd_title: { text: "search value..." },
        dd_filter: { input: { placeholder: 'Search...' } },
        dd_select_all: { class: 'd-none' },
        dd_select_list: {                    
            data: infos.dd_selectlist, dVal: "val", dTxt: "txt", attributeKey: "attr"
        },
        TabulatorObj: this.TabulatorObj,
    });
    $(".modal-body", _modal).append(dropdown);
    $("#btn_selectDropdown", _modal).attr("ins_val", $("#btn_selectDropdown").text());
},





------------

[
    {
        "txt": "Continuous",
        "val": "Continuous",
        "attr": {
            "n_hrs": "1",
            "n_days": "60"
        }
    },
    {
        "txt": "dft",
        "val": "dft",
        "attr": {
            "n_hrs": "17",
            "n_days": "47"
        }
    },
    {
        "txt": "Motion",
        "val": "Motion",
        "attr": {
            "n_hrs": "20",
            "n_days": "30"
        }
    },
    {
        "txt": "Motion 45d",
        "val": "Motion 45d",
        "attr": {
            "n_hrs": "20",
            "n_days": "45"
        }
    },
    {
        "txt": "test",
        "val": "test",
        "attr": {
            "n_hrs": "2",
            "n_days": "30"
        }
    }
]

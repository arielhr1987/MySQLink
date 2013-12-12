/**
 *
 */
Ext.define('MySQLink.ux.CodeMirrorAutocomplete', {
    extend: 'Ext.menu.Menu',
    requires: ['Ext.view.View'],
    constructor: function () {
        this.createDataView();
        Ext.apply(this, {
            cls: 'autocomplete',
            heightMax: 200, //a magic number
            plain: true,
            enableScrolling: false,
            //resizable :true,
            showSeparator: false,
            //shrinkWrap: 3,
            items: this.view,
            listeners: {
                show: this.filterData,
                hide: function () {
                    this.editor.focus()
                }
            }
        });
        this.callParent();
    },
    createDataView: function () {
        var data = [];

        Ext.each(Autocomplete.Keywords, function (item) {
            this.push({type: 'kw', name: item, text: item});
        }, data);
        Ext.each(Autocomplete.Snippets, function (item) {
            this.push({type: 'sn', name: item[0], text: item[1]});
        }, data);

        var store = Ext.create('Ext.data.Store', {
            fields: ['type', 'name', 'text'],
            data: data
        });

        this.store = store;

        var view = Ext.create('Ext.view.View', {
            cls: 'autocomplete-list',
            //autoWidth: true,
            maxHeight: 200,
            tpl: '<tpl for=".">' +
                '<div class="autocomplete-option">{name}</div>' +
                '</tpl>',
            itemSelector: 'div.autocomplete-option', //'div.autocomplete-option' 'div.completion-option'
            selectedItemCls: 'autocomplete-option-selected',
            singleSelect: true,
            store: store
        });
        view.on('selectionchange', this.handleSelectionChange, this);
        view.on('itemdblclick', this.insertText, this);
        view.on('itemkeydown', this.handleKeyDown, this);
        this.view = view;
    },
    handleSelectionChange: function (view, selections, eOpts) {
        var node = Ext.get(this.view.getSelectedNodes()[0]);
        if (this.store.getCount() > 10 && node !== null) {
            this.view.getEl().scrollChildIntoView(node, false);
        }
    },
    insertText: function (view, record) {
        var text = record.get('text'),
            token = this.getToken(),
            curPos = text.indexOf("$0"); //cursor position
        text = text.replace(/\$0/, ""); //delete cursor position substring
        this.editor.replaceRange(text, token.from, token.to);
        if (curPos != -1) {//cursor position found
            this.editor.setCursor(this.editor.getCursor().line, token.from.ch + curPos);
        }
        this.hide();
        this.editor.focus();
    },
    handleKeyDown: function (view, record, item, index, e) {
        var code = e.getKey();
        if (code == e.ENTER) {
            CodeMirror.e_stop(e);
            this.insertText(view, record);
        } else if (code != e.ESC && code != e.UP && code != e.DOWN && code != e.PAGE_UP && code != e.PAGE_DOWN) {
            this.editor.focus();
            this.editor.triggerOnKeyDown(e);
            var task = new Ext.util.DelayedTask(this.showCompletions, this);
            task.delay(200);
        }
    },
    showCompletions: function () {
        if (!this.editor.somethingSelected()) {
            var token = this.getToken();
            var pos = this.editor.charCoords(token.from);
            if (this.isVisible()) {
                this.filterData();
            }
            this.showAt(pos.x, pos.yBot, false);
            this.view.focus();
            var item = this.items.getAt(0);
            this.setActiveItem(item);

            //to solve problems with Opera and IE
            this.view.getEl().applyStyles({
             width : 'auto'
             });
             this.doComponentLayout( );
             this.view.getEl().setWidth(this.view.getEl().parent().parent().getWidth());

            this.view.setWidth();
            this.view.getEl().setWidth(this.view.getEl().parent().getWidth());
            //end problem fixing
        }
    },
    filterData: function () {
        var token = this.getToken();
        this.store.suspendEvents();
        this.store.clearFilter();
        this.store.resumeEvents();
        this.store.filter('name', new RegExp("^" + token.string, "i"));
        this.store.sort('name', 'ASC');
        this.store.getCount() == 0 ? this.hide() : this.view.select(0);
    },
    getToken: function () {
        var editor = this.editor,
            cur = editor.getCursor(),
            token = editor.getTokenAt(cur);
        token.string = token.string.substring(0, cur.ch - token.start);
        if (!/^[\w$_]*$/.test(token.string)) {
            token = {start: cur.ch, end: cur.ch, string: "", state: token.state};
        }
        var myToken = {
            string: token.string,
            from: {line: cur.line, ch: token.start},
            to: {line: cur.line, ch: token.end}
        };
        return myToken;
    }
});

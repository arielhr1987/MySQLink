/**
 *
 */
Ext.define('MySQLink.CodeMirror', {
    extend: 'Ext.panel.Panel',
    requires: [],
    initialized: false,
    xtype: 'codemirror',
    initComponent: function () {
        var $this = this;
        var toolbar = new Ext.Toolbar({
            defaults: {
                scope: this
            },
            layout: {
                overflowHandler: 'Menu'
            },
            items: [
                {
                    text: 'Undo',
                    iconCls: 'app-icon-undo',
                    handler: function () {
                        this.undo();
                    }
                },
                {
                    text: 'Redo',
                    iconCls: 'app-icon-redo',
                    handler: function () {
                        this.redo();
                    }
                },
                '-',
                {
                    text: 'Comment',
                    iconCls: 'app-icon-comment',
                    handler: function () {
                        this.comment(true);
                    }
                },
                {
                    text: 'Uncomment',
                    iconCls: 'app-icon-uncomment',
                    handler: function () {
                        this.comment(false);
                    }
                },
                {
                    text: 'Completition',
                    iconCls: 'app-icon-completition',
                    handler: function () {
                        this.showCompletions();
                    }
                },
                '->',
                {
                    xtype: 'triggerfield',
                    emptyText: 'Search text...',
                    width: 250,
                    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                    enableKeyEvents: true,
                    listeners: {
                        specialkey: function (f, e) {
                            if (e.getKey() == e.ENTER) {
                                $this.findNext(f.getValue());
                            }
                            if (e.getKey() == e.ESC) {
                                $this.clearSearch();
                                f.setValue('');
                            }
                        },
                        afterrender: function (me, eOpts) {
                            var tableEl = me.triggerWrap;
                            tableEl.down('.x-form-clear-trigger').on('click', function (e, t, eOpts) {
                                this.clearSearch();
                                me.setValue('');
                            }, $this);
                            tableEl.down('.x-form-search-trigger').on('click', function (e, t, eOpts) {
                                this.findNext(me.getValue());
                            }, $this);
                        },
						change:function(me, newValue, oldValue, eOpts){
							$this.find(newValue);
						}
                    }
                }
            ]
        });
        Ext.apply(this, {
            tbar: toolbar,
            listeners: {
                resize: function (ta, width, height) {
                    this.codemirror.refresh();
                }
            }
        });
        this.callParent();
    },
    afterRender: function () {
        //Create the CodeMirror instance
        this.codemirror = CodeMirror(this.body, {
            mode: "mysql",
            value: this.sql,//-- Press Ctrl + Space to show completions\n
            tabMode: "indent",
            lineNumbers: true,
            onCursorActivity: function (func) {
                //For select the current line
                if (func.hlLine != null) {
                    func.setLineClass(func.hlLine, "");
                }
                func.hlLine = func.getCursor().line;
                func.setLineClass(func.hlLine, null, "CodeMirror-activeline");

                //For highlight selection matches
                func.matchHighlight("CodeMirror-matchhighlight");
            }
        });
        this.codemirror.hlLine = null;

        this.codemirror.refresh();
        this.callParent();
        var map = new Ext.KeyMap(this.body, [
            {
                key: " ",
                ctrl: true,
                scope: this,
                fn: this.showCompletions

            }
        ]);
    },
    undo: function () {
        this.codemirror.undo();
    },
    redo: function () {
        this.codemirror.redo();
    },
    getQuery: function () {
        return this.codemirror.getValue();
    },
    setValue: function (v) {
        if (this.initialized) {
            //this.codemirror.setCode(v);
        }
    },
    comment: function (isComment) {
        var selected = this._selectedRange();
        this.codemirror.commentRange(isComment, selected.from, selected.to);
    },
    showCompletions: function (keyCode, e) {
        if (!MySQLink.generalMenu) {
            MySQLink.generalMenu = Ext.create('MySQLink.ux.CodeMirrorAutocomplete');//'Ext.view.BoundList' 'MySQLink.CodeMirrorCompletion'
        }
        MySQLink.generalMenu.editor = this.codemirror;
        MySQLink.generalMenu.showCompletions();
        if(e){
            e.stopEvent();
        }
    },
    _selectedRange: function getSelectedRange() {
        return { from: this.codemirror.getCursor(true), to: this.codemirror.getCursor(false) };
    },
	find: function (query) {
        CodeMirror.commandFind(this.codemirror, false, query);
    },
    findNext: function (query) {
        CodeMirror.commandFindNext(this.codemirror, false, query);
    },
	findPrev: function (query) {
        CodeMirror.commandFindNext(this.codemirror, true, query);
    },
    clearSearch: function () {
        CodeMirror.commandClearSearch(this.codemirror);
    }
})

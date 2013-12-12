/**
 *
 */
Ext.define('MySQLink.ux.FunctionGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'function-grid',
    initComponent: function () {
        this.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            autoSync: true,
            fields: ['Name', 'Definer', 'Created', 'Modified', 'Security_type', 'Comment'],
            proxy: {
                type: 'ajax',
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false, //to remove param "limit"
                noCache: false, //to remove param "_dc"
                actionMethods: {
                    read: 'POST',
                    destroy: 'POST'
                },
                api: {
                    read: this.baseURL + "function/All",
                    destroy: this.baseURL + "function/Drop"
                },
                extraParams: {
                    db: this.db,
                    host: this.host
                }
            }
        });
        this.columns = [
            //Ext.create('Ext.grid.RowNumberer'),
            { text: 'Name', dataIndex: 'Name', flex: 1 },
            { text: 'Definer', dataIndex: 'Definer', flex: 1},
            { text: 'Modified', dataIndex: 'Modified', flex: 1},
            { text: 'Created', dataIndex: 'Created', flex: 1},
            { text: 'Security type', dataIndex: 'Security_type', flex: 1 },
            { text: 'Comment', dataIndex: 'Comment', flex: 2 }
        ];
        Ext.apply(this, {
            border: 0,
            layout: 'fit',
            loadMask: true,
            selType: 'checkboxmodel',
            columnLines: true,
            tbar: this.createToolbar(),
            //forceFit :true,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            listeners: {
                selectionchange: function (me, selected, eOpts) {
                    var tb = this.getDockedItems('toolbar[dock="top"]')[0],
                        drop = tb.items.getAt(2),
                        alter = tb.items.getAt(3);
                    drop.setDisabled(selected.length < 1);
                    alter.setDisabled(selected.length != 1);
                }
            }
        });
        this.callParent();
    },
    createToolbar: function () {
        var $this = this;
        return {
            layout: {
                overflowHandler: 'Menu'
            },
            items: [
                {
                    text: 'Refresh',
                    scope: this,
                    iconCls: 'x-tbar-loading',
                    handler: function () {
                        this.getStore().reload();
                    }
                },
                {
                    text: 'Add',
                    scope: this,
                    iconCls: 'app-icon-add',
                    handler: function () {
                        //window.location = this.baseURL + 'Procedure/Create';
                        //Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', "ejemplo");
                    }
                },
                {
                    text: 'Drop',
                    scope: this,
                    disabled: true,
                    iconCls: 'app-icon-delete',
                    handler: function () {
                        var selection = this.getView().getSelectionModel().getSelection()[0];
                        if (selection) {
                            this.getStore().remove(selection);
                        }
                    }
                },
                {
                    text: 'Alter',
                    scope: this,
                    disabled: true,
                    iconCls: 'app-icon-delete',
                    handler: function () {
                        if (window.parent == window.top) {
                            //we are inside an iframe
                            var pExt = window.parent.Ext,
                                toolbar = pExt.getCmp('main-tool-bar');
                            toolbar.addTab({
                                title: 'Query Editor',
                                closable: true,
                                iconCls: 'app-icon-query-editor',
                                src: 'http://localhost/MySQLink/Simple/Query/Index/localhost'
                            });
                        } else if (window == window.top) {
                            //we are inside the top window
                        }
                    }
                },
                '->',
                {
                    xtype: 'search-field-grid',
                    emptyText: 'Search function...',
                    grid: this
                }
            ]
        };
    }
});
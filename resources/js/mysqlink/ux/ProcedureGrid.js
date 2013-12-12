/**
 *
 */
Ext.define('MySQLink.ux.ProcedureGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'procedure-grid',
    initComponent: function () {
        this.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            autoSync: true,
            fields: ['name', 'definer', 'created', 'modified','Security_type','Comment'],
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
                    read: this.baseURL + "Procedure/All",
                    destroy: this.baseURL + "Procedure/Drop"
                },
                extraParams: {
                    db: this.db,
                    host: this.host
                }
            }
        });
        this.columns = [
            //Ext.create('Ext.grid.RowNumberer'),
            { text: 'Name', dataIndex: 'name' ,flex:1 },
            { text: 'Definer', dataIndex: 'definer' ,flex:1},
            { text: 'Modified', dataIndex: 'modified' ,flex:1},
            { text: 'Created', dataIndex: 'created' ,flex:1},
            { text: 'Security type', dataIndex: 'Security_type',flex:1 },
            { text: 'Comment', dataIndex: 'Comment',flex:2 }/*,
             {
             text: 'Action',
             dataIndex: 'name',
             renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
             var val = "<a  href='examples/index.html'>Alter</a>";
             return val;
             }
             }*/
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
                        Ext.create('Ext.Window', {
                            title: 'Procedure Editor',
                            width: '95%',
                            height: '95%',
                            //plain: true,
                            layout: 'fit',
                            //overflowY: 'auto',
                            autoScroll: true,
                            modal: true,
                            items: {
                                xtype: 'procedure-editor',
                                border: false
                            }
                        }).show();
                    }
                },
                '->',
				{
					xtype: 'search-field-grid',
					emptyText: 'Search procedure...',
					grid:this/*,
					column:1*/
				}
            ]
        };
    }
});
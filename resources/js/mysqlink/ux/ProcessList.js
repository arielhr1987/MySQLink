/**
 *
 */
Ext.define('ProcessList', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'process-list',
    initComponent: function () {
        var model = Ext.define('ProcessListModel', {
            extend: 'Ext.data.Model',
            fields: ['Id', 'User', 'Host', 'db', 'Command', 'Time', 'State', 'Info', 'groupHost']
        });
        var store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            autoSync: true,
            model: 'ProcessListModel',
            groupField: 'groupHost',
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
                    read: "Server/process",
                    destroy: "Server/kill"
                }
            }
        });
        Ext.apply(this, {
            store: store,
            loadMask: true,
            selType: 'checkboxmodel',
            forceFit: true,
            tbar: this.createToolbar(),
            features: [
                {
                    ftype: 'grouping',
                    enableGroupingMenu: false,
                    groupHeaderTpl: 'Server: {name}'
                }
            ],
            columns: [
                { text: 'Id', dataIndex: 'Id' },
                { text: 'User', dataIndex: 'User'},
                { text: 'Host', dataIndex: 'Host' },
                { text: 'DB', dataIndex: 'db' },
                { text: 'Command', dataIndex: 'Command' },
                { text: 'Time', dataIndex: 'Time' },
                { text: 'State', dataIndex: 'State' },
                { text: 'Info', dataIndex: 'Info' }
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            listeners: {
                selectionchange: function (me, selected, eOpts) {
                    var tb = this.getDockedItems('toolbar[dock="top"]')[0],
                        kill = tb.items.getAt(1);
                    kill.setDisabled(selected.length < 1);
                }
            }
        });
        this.callParent();
    },
    createToolbar: function () {
        return[
            {
                text: 'Refresh',
                scope: this,
                iconCls: 'x-tbar-loading',
                handler: function () {
                    this.getStore().reload();
                }
            },
            {
                text: 'Kill process',
                scope: this,
                disabled: true,
                iconCls: 'app-icon-delete',
                handler: function () {
                    var selection = this.getView().getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        this.getStore().remove(selection);
                    }
                }
            },{
                text:'&raquo;'
            }
        ]

    }
});
/**
 *
 */
Ext.define('TreenodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'xid', type: 'string'},
        {name: 'text', type: 'string'}
    ]
});

Ext.define('MySQLink.ux.MainTreeview', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.tree.*',
        'Ext.data.*'
    ],
    xtype: 'main-treeview',
    title: 'Servers',
    useArrows: true,
    rootVisible: false,
    initComponent: function () {
        //to remove the _dc parameter
        Ext.Ajax.disableCaching = false;

        Ext.apply(this, {
            store: new Ext.data.TreeStore({
                model: 'TreenodeModel',
                proxy: {
                    type: 'ajax',
                    pageParam: false, //to remove param "page"
                    startParam: false, //to remove param "start"
                    limitParam: false, //to remove param "limit"
                    noCache: false, //to remove param "_dc"
                    url: 'Tree',
                    actionMethods: {
                        read: 'POST'
                    }
                },
                root: {
                    xid: 'root',
                    id: 'root',
                    expanded: true
                },
                listeners: {
                    beforeLoad: function (store, operation, eOpts) {
                        var nodePath = operation.node.getPath('xid');
                        operation.params.nodePath = nodePath;
                        operation.params.host = nodePath.split('/')[2];
                        operation.params.db = nodePath.split('/')[3];
                    }
                }
            }),
            tbar: [
                /*{
                 text: 'Expand All',
                 scope: this,
                 handler: this.onExpandAllClick
                 },
                 {
                 text: 'Collapse All',
                 scope: this,
                 handler: this.onCollapseAllClick
                 },*/
                {
                    text: 'Refresh',
                    scope: this,
                    iconCls: 'x-tbar-loading',
                    handler: this.onRefreshNode
                }
            ]
        });
        this.callParent();
    },

    onExpandAllClick: function () {
        var me = this,
            toolbar = me.down('toolbar');
        me.getEl().mask('Expanding tree...');
        toolbar.disable();
        this.expandAll(function () {
            me.getEl().unmask();
            toolbar.enable();
        });
    },

    onCollapseAllClick: function () {
        var toolbar = this.down('toolbar');
        toolbar.disable();
        this.collapseAll(function () {
            toolbar.enable();
        });
    },

    onRefreshNode: function () {
        var node = this.getSelectionModel().getSelection()[0];
        //var node = this.store.getNodeById(id);
        if (node && !node.isLoading()){
            this.store.load({node: node});
        }
    }
});

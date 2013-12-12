/**
 *
 */
Ext.define('MySQLink.ux.QueryGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            autoDestroy: true,
            fields: []
        });
        this.columns = [];
        //var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        Ext.apply(this, {
            border: 0,
            region: 'center',
            //plugins: 'bufferedrenderer',
            loadMask: true,
            columnLines: true,
            //plugins: [rowEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }
        });
        this.callParent();
    },
    setStatus: function (text, iconCls) {
        this.bbar.setStatus({
            text: text,
            iconCls: iconCls
        });
    },
    loadData: function (data) {
        var columns = [Ext.create('Ext.grid.RowNumberer', {width: 30})],
            fields = [];
        Ext.each(data.meta, function (c) {
            columns.push({
                dataIndex: c.name,
                header: c.name
            });
            //the model
            fields.push({
                name: c.name,
                type: c.type == null ? 'string' : c.type,
                mapping: c.orgname
            });
        }, this);
        var store = Ext.create('Ext.data.JsonStore', {
            //autoDestroy: true,
            data: data.rows,
            //proxy:{type:'json'},
            fields: fields
        });
        this.reconfigure(store, columns);
    }
});
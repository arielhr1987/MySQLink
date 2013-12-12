/**
 *
 */
Ext.define('MySQLink.ux.ParameterGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'parameter-grid',
    initComponent: function () {
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['mode', 'name', 'type'],
            data: [
                {mode: 'IN', name: 'param1', type: 'int'}
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'users'
                }
            }
        });
        this.columns = [
            {
                text: 'Mode',
                dataIndex: 'mode',
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    store: [
                        ['IN', 'IN'],
                        ['OUT', 'OUT'],
                        ['INOUT', 'INOUT']
                    ],
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })},
            {
                text: 'Name',
                dataIndex: 'name',
                editor: {}
            },
            {
                text: 'Type',
                dataIndex: 'type',
                editor: {}
            }
        ];
        Ext.apply(this, {
            //border: 0,
            layout: 'fit',
            loadMask: true,			
			//maxHeight:114,
            selType: 'checkboxmodel',
            columnLines: true,
            plugins: [this.cellEditing],
            tbar: this.createToolbar(),
            forceFit: true,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            listeners: {
                selectionchange: function (me, selected, eOpts) {
                    var tb = this.getDockedItems('toolbar[dock="top"]')[0],
                        del = tb.items.getAt(1),
                        up = tb.items.getAt(2),
                        down = tb.items.getAt(3);
                    del.setDisabled(selected.length < 1);
                    up.setDisabled(!(selected.length == 1 && this.store.indexOf(selected[0]) > 0 ));
                    down.setDisabled(!(selected.length == 1 && this.store.indexOf(selected[selected.length - 1]) < this.store.getCount() - 1));
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
                    text: 'Add',
                    scope: this,
                    iconCls: 'app-icon-add',
                    handler: function () {
                        this.store.add({mode: '', name: '', type: ''})
                    }
                },
                {
                    text: 'Delete',
                    scope: this,
                    disabled: true,
                    iconCls: 'app-icon-delete',
                    handler: function () {
                        var selected = this.getSelectionModel().getSelection();
                        this.store.remove(selected);
                    }
                },
                {
                    text: 'Up',
                    scope: this,
                    disabled: true,
                    iconCls: 'app-icon-arrow-up',
                    handler: function () {
                        var selected = this.getSelectionModel().getSelection()[0],
                            index = this.store.indexOf(selected);
                        selected.selected = true;
                        this.store.remove(selected);
                        this.store.insert(index - 1, selected);
                        this.getSelectionModel().select(index - 1);
                    }
                },
                {
                    text: 'Down',
                    scope: this,
                    disabled: true,
                    iconCls: 'app-icon-arrow-down',
                    handler: function () {
                        var selected = this.getSelectionModel().getSelection()[0],
                            index = this.store.indexOf(selected);
                        this.store.remove(selected);
                        this.store.insert(index + 1, selected);
                        this.getSelectionModel().select(index + 1);
                    }
                }
            ]
        };
    }
});
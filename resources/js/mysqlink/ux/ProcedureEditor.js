/**
 *
 */
Ext.define('MySQLink.ux.ProcedureEditor', {
    extend: 'Ext.form.Panel',//Ext.panel.Panel
    requires: [],
    xtype: 'procedure-editor',
    initComponent: function (config) {
        Ext.applyIf(this, {
            host: '',
            db: '',
            name: ''
        });
        this.createFields();
        config = Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults: {
                labelAlign: 'left'
            },
            defaults: {
                padding: '5 5 0 5'
            },
            items: [this.nameField, this.parameterField, this.definitionField],
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Save',
                    scope: this,
                    handler: function () {
                        //this.up('form').getForm().isValid();
                        //var def = this.getDefinition();
                        this.save();
                    }
                },
                {
                    text: 'Cancel',
                    scope: this,
                    handler: function () {
                        //this.up('form').getForm().reset();
                    }
                }
            ]
        });
        this.callParent();
    },
    createFields: function () {
        this.nameField = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            padding: '5 5 0 5',
            allowBlank: false
        });
        this.parameterField = Ext.create('MySQLink.ux.ParameterGrid', {
            title: 'Parameters',
            flex: 1,
            minHeight: 148,
            name: 'params'
        });
        this.definitionField = Ext.create('MySQLink.CodeMirror', {
            //collapsible: true,
            title: 'Definition',
            xtype: 'codemirror',
            padding: '5 5 5 5',
            flex: 2,
            layout: 'fit'
        });
    },
    getDefinition: function () {
        var p = [],
            store = this.parameterField.store;
        for (var i = 0; i < store.getCount(); i++) {
            p.push(store.getAt(i).getData());
        }
        var def = {
            name: this.nameField.getValue(),
            parameters: p,
            definition: this.definitionField.getQuery()

        }
        return def;
    },
    save: function () {
        Ext.Ajax.request({
            scope: this,
            url: this.baseURL + 'Procedure/Save',
            params: {
                host: this.host,
                db: this.db,
                definition: Ext.JSON.encode(this.getDefinition())
            },
            success: function (resp, opts) {

            },
            failure: function () {

            }
        });
    }
});

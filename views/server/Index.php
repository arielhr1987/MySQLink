<html>
<head>
    <title>Server monitor</title>
    <?php
        extjs();
        link_tag('mysqlink/MySQLink');
        script('mysqlink/ux/ServerMonitor');
        script('mysqlink/ux/ProcessList');
        script('mysqlink/ux/ServerVariables');
		script('mysqlink/ux/SearchFieldGrid');
        script('mysqlink/ux/EngineGrid');
        script('mysqlink/ux/CharacterSetGrid');
    ?>
    <script>
        Ext.onReady(function () {
            Ext.create('Ext.container.Viewport', {
                layout: 'border',
                items: [
                    {
                        xtype: 'server-monitor',
                        region: 'center',
                        border: false
                    }
                ]
            });
        });
    </script>
</head>
<body>
</body>
</html>



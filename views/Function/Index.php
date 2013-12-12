<!doctype html>
<html>
<head>
    <title>Procedures</title>
    <?php
        extjs();
        link_tag('mysqlink/MySQLink');
        script('mysqlink/ux/FunctionGrid');
        script('mysqlink/ux/SearchFieldGrid');
    ?>
</head>
<body>


<script>

    Ext.onReady(function () {
        Ext.require(['*']);
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'function-grid',
                    region: 'center',
                    db: '<?php echo $db; ?>',
                    host: '<?php echo $host; ?>',
                    baseURL: '<?php echo Core::base_url(); ?>'
                }
            ]
        });
    })
</script>
</body>
</html>
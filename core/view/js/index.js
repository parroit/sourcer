(function(){
    $(document).ready( function() {

        // TABS-WEST - sortable
        $(".ui-layout-west")
            .tabs()
            .find(".ui-tabs-nav")
            .sortable({ axis: 'x', zIndex: 2 })
        ;

        // TABS-EAST - sortable
        $(".ui-layout-east")
            .tabs()
            .find(".ui-tabs-nav")
            .sortable({ axis: 'x', zIndex: 2 })
        ;

        // TABS-CENTER - sortable
        $(".ui-layout-center")
            .tabs({
                change: function () {  }
            })
            .find(".ui-tabs-nav")
            .sortable({ axis: 'x', zIndex: 2 })
        ;

        // PAGE LAYOUT
        var myLayout = $('body').layout();



    });
})();

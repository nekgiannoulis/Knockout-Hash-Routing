
$(document).ready(function () {

    var vm = {
        NavigationId: ko.observable("welcome"),
        Username: ko.observable("loco"),

        Navigate: function (name) {
            vm.NavigationId(name);
        }
    };

    HashListener.Register("navId", vm.NavigationId,
    function (oldValue, newValue) {
        //var lala = newValue;
    });


    HashListener.Register("userId", vm.Username,
    function (oldValue, newValue) {
        //var lala = newValue;
    });


    ko.applyBindings(vm);
});



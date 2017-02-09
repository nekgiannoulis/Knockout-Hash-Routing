
$(document).ready(function () {

    var vm = {
        Test: ko.observable("test value"),
        Test2: ko.observable("test value 2"),

        UpdateTest: function () {

            vm.Test("12334234sdf");
        },

        UpdateTest2: function () {
            vm.Test2("NEKNEK");
        },

        GeneralTesting: function () {
            history.pushState(null, "Project - ", "?generalTest=5");
            HashListener.UpdateFromUrl();
        }
    };

    HashListener.Register("test", vm.Test,
    function (oldValue, newValue) {
        var lala = newValue;
    });


    HashListener.Register("test22", vm.Test2,
    function (oldValue, newValue) {
        var lala = newValue;
    });


    ko.applyBindings(vm);
});



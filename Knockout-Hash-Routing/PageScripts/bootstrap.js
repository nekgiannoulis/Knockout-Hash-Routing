
$(document).ready(function () {

    var vm = {
        NavigationId: ko.observable("home"),

        ColorTab: {
            AvailableColors: ["red", "blue", "green", "yellow"],
            SelectedColor: ko.observable("red"),
        },

        PlansTab: {
            PlanKey: ko.observable("free"),
            AvailablePlans: [
                { Key: "free", Text: "Free", Descr: "Free, limited plan", Price: "free" },
                { Key: "basic", Text: "Basic", Descr: "Basic, some features locked", Price: "1.99$" },
                { Key: "premium", Text: "Premium", Descr: "Premium, all features available", Price: "3.49$" },
            ],
            SelectedPlan: ko.observable()
        },


        Navigate: function (name) {
            vm.NavigationId(name);
        }
    };

    HashListener.Register("n", vm.NavigationId);

    HashListener.Register("col", vm.ColorTab.SelectedColor);
    vm.ColorTab.SelectedColor.HashRouting.SkipHistory = true;

    HashListener.Register("plan", vm.PlansTab.PlanKey, function (oldValue, newValue) {
        //select plan based on url key
        for (var i = 0; i < vm.PlansTab.AvailablePlans.length; i++) {
            var plan = vm.PlansTab.AvailablePlans[i];
            if (plan.Key === newValue) {
                vm.PlansTab.SelectedPlan(plan);
                break;
            }
        }
    });

    ko.applyBindings(vm);
});

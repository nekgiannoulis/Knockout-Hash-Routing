

var HashRouting = {
    HistoryName: "History",
    Routings: [],

    Register: function (parameterName, koObservable, changedCallback) {
        koObservable.HashRouting = {
            ParameterName: parameterName,
            KoObservable: koObservable,
            ChangedCallback: changedCallback,
            InitialValue: koObservable(),
            SkipHashWhenInitial: true
        };

        koObservable.Update = function (data) {
            koObservable(data);
        }

        var params = HashRouting.GetUrlVars();
        var val = params[parameterName];
        if (val) {
            koObservable(val);
        }

        HashRouting.Routings.push(koObservable.HashRouting);

        koObservable.subscribe(function (newValue) {
            var routing = koObservable.HashRouting;
            var hashes = HashRouting.GetUrlVars()[routing.ParameterName];
            if (!hashes && newValue == routing.InitialValue) {
                return;
            }

            if (hashes != newValue) {
                var url = HashRouting.ConstructUrlString();
                history.pushState(null, HashRouting.HistoryName, url);
                if (routing.ChangedCallback) {
                    if (!hashes) {
                        routing.ChangedCallback(routing.InitialValue, newValue);
                    } else {
                        routing.ChangedCallback(hashes, newValue);
                    }
                }
            }
        });

        window.onpopstate = function () {
            HashRouting.UpdateFromUrl();
        }

        if (koObservable()) {
            if (koObservable.HashRouting.ChangedCallback) {
                koObservable.HashRouting.ChangedCallback(null, koObservable());
            }
        }
    },

    UpdateFromUrl: function () {
        var vars = HashRouting.GetUrlVars();
        $.each(HashRouting.Routings, function (index, routing) {
            var paramValue = vars[routing.ParameterName];
            if (!paramValue) {
                if (routing.InitialValue != routing.KoObservable()) {
                    if (routing.ChangedCallback) {
                        routing.ChangedCallback(routing.KoObservable(), routing.InitialValue);
                    }
                    routing.KoObservable(routing.InitialValue);
                }
            } else if (paramValue != routing.KoObservable()) {
                if (routing.ChangedCallback) {
                    routing.ChangedCallback(routing.KoObservable(), paramValue);
                }
                routing.KoObservable(paramValue);
            }
        });
    },

    ConstructUrlString: function () {
        var url = "?";
        var proccessed = [];
        var paramsCount = 0;

        var addParam = function (name, value) {
            if (paramsCount > 0)
                url += "&";
            url += name + "=" + value;
            paramsCount++;
        };

        $.each(HashRouting.Routings, function (index, reg) {
            if (!(reg.SkipHashWhenInitial && reg.KoObservable() === reg.InitialValue)) {
                addParam(reg.ParameterName, reg.KoObservable());
            }
            proccessed.push(reg.ParameterName);
        });

        var currentVars = HashRouting.GetUrlVars();
        $.each(currentVars, function (index, rec) {
            if (proccessed.indexOf(rec) < 0) {
                addParam(rec, currentVars[rec]);
            }
        });

        if (url == "?")
            return "?";
        return url;
    },

    //Read a page's GET URL variables and return them as an associative array.
    GetUrlVars: function () {
        console.log("Getting urls");
        var vars = [], hash;
        var qIndex = window.location.href.indexOf("?");
        if (qIndex < 0 || qIndex == window.location.href.length - 1)
            return vars;

        var hashes = window.location.href.slice(qIndex + 1).split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            hash[1] = hash[1].replace("#", "");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}



var HashListener = {
    HistoryName: "History",
    Routings: [],

    Register: function (parameterName, koObservable, changedCallback) {
        koObservable.HashRouting = {
            ParameterName: parameterName,
            KoObservable: koObservable,
            ChangedCallback: changedCallback,
            InitialValue: koObservable(),
            SkipHistory: false,
            NoHashWhenInitial: false
        };

        var params = HashListener.GetUrlVars();
        var val = params[parameterName];
        if (val) {
            koObservable(val);
        }

        HashListener.Routings.push(koObservable.HashRouting);

        koObservable.subscribe(function (newValue) {
            var routing = koObservable.HashRouting;
            var hashes = HashListener.GetUrlVars()[routing.ParameterName];
            if (!hashes && newValue == routing.InitialValue) {
                return;
            }

            if (hashes != newValue) {
                var url = HashListener.ConstructUrlString();
                //if (routing.SkipHistory) {
                //    history.replaceState(undefined, undefined, url);
                //} else {
                    history.pushState(null, HashListener.HistoryName, url);
                //}
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
            HashListener.UpdateFromUrl();
        }

        if (koObservable()) {
            if (koObservable.HashRouting.ChangedCallback) {
                koObservable.HashRouting.ChangedCallback(null, koObservable());
            }
        }
    },

    UpdateFromUrl: function () {
        var vars = HashListener.GetUrlVars();
        $.each(HashListener.Routings, function (index, routing) {
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
        var found = [];
        $.each(HashListener.Routings, function (index, reg) {
            if (reg.KoObservable()) {
                if (index > 0)
                    url += "&";
                url += reg.ParameterName + "=" + reg.KoObservable();
                found.push(reg.ParameterName);
            }
        });

        var currentVars = HashListener.GetUrlVars();
        $.each(currentVars, function (index, rec) {
            if (found.indexOf(rec) < 0) {
                url += "&" + rec + "=" + currentVars[rec];
            }
        });

        if (url == "?")
            return null;
        return url;
    },

    //Read a page's GET URL variables and return them as an associative array.
    GetUrlVars: function () {
        console.log("Getting urls");
        var vars = [], hash;
        var qIndex = window.location.href.indexOf("?");
        if (qIndex < 0)
            return vars;

        var hashes = window.location.href.slice(qIndex + 1).split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}

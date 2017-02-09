

var HashListener = {
    HistoryName: "History",
    Registrations: [],

    Register: function (parameterName, koObservable, changedCallback) {
        koObservable.HashRegistration = {
            ParameterName: parameterName,
            KoObservable: koObservable,
            ChangedCallback: changedCallback,
            InitialValue: koObservable()
        };

        var params = HashListener.GetUrlVars();
        var val = params[parameterName];
        if (val) {
            koObservable(val);
        }

        HashListener.Registrations.push(koObservable.HashRegistration);

        koObservable.subscribe(function (newValue) {
            var reg = koObservable.HashRegistration;
            var hashes = HashListener.GetUrlVars()[reg.ParameterName];
            if (!hashes && newValue == reg.InitialValue) {
                return;
            }

            if (hashes != newValue) {
                var url = HashListener.ConstructString();
                history.pushState(null, HashListener.HistoryName, url);
                if (reg.ChangedCallback) {
                    if (!hashes) {
                        reg.ChangedCallback(reg.InitialValue, newValue);
                    } else {
                        reg.ChangedCallback(hashes, newValue);
                    }
                }
            }
        });

        window.onpopstate = function (e) {
            HashListener.UpdateFromUrl();
        }

        if (koObservable()) {
            if (koObservable.HashRegistration.ChangedCallback) {
                koObservable.HashRegistration.ChangedCallback(null, koObservable());
            }
        }
    },

    UpdateFromUrl: function () {
        var vars = HashListener.GetUrlVars();
        $.each(HashListener.Registrations, function (index, reg) {
            var paramValue = vars[reg.ParameterName];
            if (!paramValue) {
                if (reg.InitialValue != reg.KoObservable()) {
                    if (reg.ChangedCallback) {
                        reg.ChangedCallback(reg.KoObservable(), reg.InitialValue);
                    }
                    reg.KoObservable(reg.InitialValue);
                }
            } else if (paramValue != reg.KoObservable()) {
                if (reg.ChangedCallback) {
                    reg.ChangedCallback(reg.KoObservable(), paramValue);
                }
                reg.KoObservable(paramValue);
            }
        });
    },

    ConstructString: function () {
        var url = '?';
        var found = [];
        $.each(HashListener.Registrations, function (index, reg) {
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

        if (url == '?')
            return null;
        return url;
    },

    //Read a page's GET URL variables and return them as an associative array.
    GetUrlVars: function () {
        console.log("Getting urls");
        var vars = [], hash;
        var qIndex = window.location.href.indexOf('?');
        if (qIndex < 0)
            return vars;

        var hashes = window.location.href.slice(qIndex + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}

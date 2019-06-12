var sampleRate, outputBufferLength;
var recBuffers = [];
onmessage = function(a) {
    switch (a.data.command) {
    case "init":
        init(a.data.config);
        break;
    case "record":
        record(a.data.buffer);
        break;
    case "reset":
        reset();
        break  
    }
};
function init(a) {
    sampleRate = a.sampleRate;
    outputBufferLength = a.outputBufferLength
}
function reset() {
    recBuffers = []
}
function record(f) {
    var h = new Resampler(sampleRate, 16000, 1, outputBufferLength, true);
    var d;
    var j = [];
    for (d = 0; d < f.length; d++) {
        j.push(f[d])
    }
    var b = h.resampler(j);
    var a = new Float32Array(b);
    for (d = 0; d < b; d++) {
        a[d] = h.outputBuffer[d]
    }
    var c = floatTo16BitPCM(a);
    for (d = 0; d < c.length; d++) {
        recBuffers.push(c[d])
    }
    while (recBuffers.length > 320) {
        var g = recBuffers.splice(0, 320);
        var k = new Int16Array(g);
        var e = getVolume(k);
        this.postMessage({
            "volume": e,
            "buffer": k
        })
    }
}
var getVolume = function(d) {
    var b = [329, 421, 543, 694, 895, 1146, 1476, 1890, 2433, 3118, 4011, 5142, 6612, 8478, 10900, 13982, 17968, 23054, 29620, 38014, 48828, 62654, 80491, 103294, 132686, 170366, 218728, 280830];
    var a = function(e) {
        var f = 30;
        b.every(function(h, g) {
            if (e < h) {
                f = g;
                return false
            }
            return true
        });
        return f
    };
    var c = function(g) {
        if (g == null || g.byteLength <= 2) {
            return 0
        }
        var h = 0;
        var e;
        for (e = 0; e < g.length; e++) {
            h += g[e]
        }
        h /= g.length;
        var f = 0;
        for (e = 0; e < g.length; e++) {
            f += parseInt(Math.pow(g[e] - h, 2)) >> 9
        }
        f /= g.length;
        return parseInt(f)
    };
    return a(c(d))
};
function floatTo16BitPCM(b) {
    var a = new Int16Array(b.length);
    for (var c = 0; c < b.length; c++) {
        var d = Math.max( - 1, Math.min(1, b[c]));
        if (d < 0) {
            a[c] = d * 32768
        } else {
            a[c] = d * 32767
        }
    }
    return a
}
function Resampler(c, e, b, d, a) {
    this.fromSampleRate = c;
    this.toSampleRate = e;
    this.channels = b | 0;
    this.outputBufferSize = d;
    this.noReturn = !!a;
    this.initialize()
}
Resampler.prototype.initialize = function() {
    if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
        if (this.fromSampleRate == this.toSampleRate) {
            this.resampler = this.bypassResampler;
            this.ratioWeight = 1
        } else {
            if (this.fromSampleRate < this.toSampleRate) {
                this.lastWeight = 1;
                this.resampler = this.compileLinearInterpolation
            } else {
                this.tailExists = false;
                this.lastWeight = 0;
                this.resampler = this.compileMultiTap
            }
            this.ratioWeight = this.fromSampleRate / this.toSampleRate;
            this.initializeBuffers()
        }
    } else {
        throw (new Error("Invalid settings specified for the resampler."))
    }
};
Resampler.prototype.compileLinearInterpolation = function(g) {
    var a = g.length;
    var f = this.outputBufferSize;
    if ((a % this.channels) == 0) {
        if (a > 0) {
            var e = this.ratioWeight;
            var h = this.lastWeight;
            var j = 0;
            var d = 0;
            var c = 0;
            var b = this.outputBuffer;
            var i;
            for (; h < 1; h += e) {
                d = h % 1;
                j = 1 - d;
                for (i = 0; i < this.channels; ++i) {
                    b[c++] = (this.lastOutput[i] * j) + (g[i] * d)
                }
            }
            h--;
            for (a -= this.channels, sourceOffset = Math.floor(h) * this.channels; c < f && sourceOffset < a;) {
                d = h % 1;
                j = 1 - d;
                for (i = 0; i < this.channels; ++i) {
                    b[c++] = (g[sourceOffset + i] * j) + (g[sourceOffset + this.channels + i] * d)
                }
                h += e;
                sourceOffset = Math.floor(h) * this.channels
            }
            for (i = 0; i < this.channels; ++i) {
                this.lastOutput[i] = g[sourceOffset++]
            }
            this.lastWeight = h % 1;
            return this.bufferSlice(c)
        } else {
            return (this.noReturn) ? 0 : []
        }
    } else {
        throw (new Error("Buffer was of incorrect sample length."))
    }
};
Resampler.prototype.compileMultiTap = function(i) {
    var e = [];
    var a = i.length;
    var h = this.outputBufferSize;
    if ((a % this.channels) == 0) {
        if (a > 0) {
            var g = this.ratioWeight;
            var j = 0;
            for (var k = 0; k < this.channels; ++k) {
                e[k] = 0
            }
            var l = 0;
            var m = 0;
            var d = !this.tailExists;
            this.tailExists = false;
            var c = this.outputBuffer;
            var b = 0;
            var f = 0;
            do {
                if (d) {
                    j = g;
                    for (k = 0; k < this.channels; ++k) {
                        e[k] = 0
                    }
                } else {
                    j = this.lastWeight;
                    for (k = 0; k < this.channels; ++k) {
                        e[k] += this.lastOutput[k]
                    }
                    d = true
                }
                while (j > 0 && l < a) {
                    m = 1 + l - f;
                    if (j >= m) {
                        for (k = 0; k < this.channels; ++k) {
                            e[k] += i[l++] * m
                        }
                        f = l;
                        j -= m
                    } else {
                        for (k = 0; k < this.channels; ++k) {
                            e[k] += i[l + k] * j
                        }
                        f += j;
                        j = 0;
                        break
                    }
                }
                if (j == 0) {
                    for (k = 0; k < this.channels; ++k) {
                        c[b++] = e[k] / g
                    }
                } else {
                    this.lastWeight = j;
                    for (k = 0; k < this.channels; ++k) {
                        this.lastOutput[k] = e[k]
                    }
                    this.tailExists = true;
                    break
                }
            } while ( l < a && b < h );
            return this.bufferSlice(b)
        } else {
            return (this.noReturn) ? 0 : []
        }
    } else {
        throw (new Error("Buffer was of incorrect sample length."))
    }
};
Resampler.prototype.bypassResampler = function(a) {
    if (this.noReturn) {
        this.outputBuffer = a;
        return a.length
    } else {
        return a
    }
};
Resampler.prototype.bufferSlice = function(a) {
    if (this.noReturn) {
        return a
    } else {
        try {
            return this.outputBuffer.subarray(0, a)
        } catch(b) {
            try {
                this.outputBuffer.length = a;
                return this.outputBuffer
            } catch(b) {
                return this.outputBuffer.slice(0, a)
            }
        }
    }
};
Resampler.prototype.initializeBuffers = function() {
    try {
        this.outputBuffer = new Float32Array(this.outputBufferSize);
        this.lastOutput = new Float32Array(this.channels)
    } catch(a) {
        this.outputBuffer = [];
        this.lastOutput = []
    }
};
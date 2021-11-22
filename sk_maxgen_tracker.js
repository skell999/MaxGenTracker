
var Tracker = function()
{
	this.edit_index = 0;
	this.play_index = 0;
	this.seq = new Array(128);
	this.len = 16;
	this.pb = 12;
	this.scale = [0, 2, 3, 5, 7, 8, 10];
	this.cc = {};
	this.cc.aenv = [2,3,4,5];

	for(var i = 0; i < this.seq.length; i++)
	{
		this.seq[i] = {
			noteNum:null,
			velo:null,
			dur:null,
			glide:null,
			penv:null,
			aenv:null,
			tenv:null
		};
	}

	this.pos = function(val)
	{
		this.edit_index = val
		return this;
	} 

	this.tnote = function(noteNum,octave)
	{

		octave += Math.floor((noteNum - 1) / this.scale.length); // Octave offset for notes greater than this.scale.length
		octave *= 12;

		noteNum = this.scale[(noteNum - 1) % (this.scale.length)] + octave;

		if(noteNum > 127){ noteNum = 127;} // Clamp
		if(noteNum < 0){ noteNum = 0;}

		if(isNaN(noteNum)){ error("[Error In Method] Tracker.tnote() noteNum is nan\n"); }

		this.seq[this.edit_index]['noteNum'] = noteNum;
		return this;
	}

	this.velo = function(velo)
	{
		this.seq[this.edit_index]['velo'] = velo;
		return this;
	}

	this.dur = function(dur)
	{
		this.seq[this.edit_index]['dur'] = dur;
		return this;
	}


	this.glide = function(val)
	{
		this.seq[this.edit_index]['glide'] = val;
		return this;
	}

	this.penv = function(atk,rel)
	{
		this.seq[this.edit_index]['p_atk'] = atk;
		this.seq[this.edit_index]['p_rel'] = rel;
		return this;
	}

	this.aenv = function(atk,dec,sus,rel)
	{
		this.seq[this.edit_index]['aenv'] = [atk,dec,sus,rel];
		return this;
	}

	this.tenv = function(atk,dec,sus,rel)
	{
		this.seq[this.edit_index]['t_atk'] = atk;
		this.seq[this.edit_index]['t_dec'] = dec;
		this.seq[this.edit_index]['t_sus'] = sus;
		this.seq[this.edit_index]['t_rel'] = rel;
		return this;
	}

	this.get = function(val)
	{
		this.play_index = val;
		var arr = [];
		for(var i in this.seq[val])
		{
			var current_val = this.seq[val][i];
			if(current_val === null)
			{
				arr.push("null");
			}else
			{
				arr.push(current_val);
			}
		}
		//outlet(0,arr);


		if(this.seq[val].aenv != null)
		{
			for(var i = 0; i < 4; i++)
			{
				var ccNum = this.cc.aenv[i];
				var ccVal = (this.seq[val].aenv[i] / 100) * 127;
				cc(ccNum, ccVal, 1);
				post(ccNum,ccVal);
			}
		}


		if(this.seq[val].noteNum != null)
		{
			note(this.seq[val].noteNum,this.seq[val].velo,this.seq[val].dur,1);
			// note(60,100,1/16,1);
		}

		return arr;
	}
}

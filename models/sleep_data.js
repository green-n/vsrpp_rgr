module.exports=(sequelize,DataTypes)=>{
    const SleepData=sequelize.define('SleepData',{
        userId:{
            allowNull:false,
            type:DataTypes.INTEGER,
            references:{
                model:'Users',
                key:'id'
            },
            validate : {
                notEmpty: true
            }

        },
  
        sleepTime:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate : {
                notEmpty: true
            }
        },
        sleepQuality:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate : {
                notEmpty: true
            }
        },
    });
    return SleepData;
}
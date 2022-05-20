module.exports=(sequelize,DataTypes)=>{
    const User=sequelize.define('User',{
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate : {
                notEmpty: true
            }
        },
       
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate : {
                notEmpty: true
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate : {
                notEmpty: true
            }
        },
        rights:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        }
    }); 
   
    return User;
}

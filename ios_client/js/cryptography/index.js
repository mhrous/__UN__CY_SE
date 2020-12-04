


 const encrypt = ({data }) => {

        switch (TYPE_ACTIVE) {
            case TYPE_LIST.SYMMETRIC:
                return symmetricCryptography.encrypt(data)
            case TYPE_LIST.ASYMMETRIC:
                return asymmetricCryptography.encrypt(data)
            case TYPE_LIST.HYBRID:
                return hybridCryptography.encrypt(data)
            default:
                return data
        }

}

 const decrypt = ({data}) => {

        switch (TYPE_ACTIVE) {
            case TYPE_LIST.SYMMETRIC:

                return symmetricCryptography.decrypt(data)
            case TYPE_LIST.ASYMMETRIC:
                return asymmetricCryptography.decrypt(data)
            case TYPE_LIST.HYBRID:
                return hybridCryptography.decrypt(data)
            default:
                return data
        }


}
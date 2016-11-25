package com.anjz.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataAccessException;

import com.anjz.exception.BusinessException;
import com.anjz.result.BaseResult;
import com.anjz.result.CommonResultCode;
import com.anjz.result.IErrorCode;
import com.anjz.result.ListResult;
import com.anjz.result.PlainResult;

/**
 * Service层异常拦截
 */
@Aspect
@Order(Ordered.HIGHEST_PRECEDENCE)
@SuppressWarnings("rawtypes")
public class ExceptionHandleAspect {
    private final Logger logger = LoggerFactory.getLogger(ExceptionHandleAspect.class);

    @Around("within(com.anjz.core.service..*)")
    public Object handleException(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result = null;
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();

        Class returnType = signature.getReturnType();
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            //log error msg
            logError(signature.toString(), ex);

            //translate exception to BaseResult
            result = ExceptionTranslator.translate(ex, returnType);
            
            //如果拦截的方法，返回值不是BaseResult自己或父类，仅需抛异常，交给springmvc处理
            if(result==null){
            	throw ex;
            }
        }

        return result;
    }

    private void logError(String method, Throwable ex) {
        logger.error("exception throwed by method: {}, error is {}", method, ex.getMessage());
        ex.printStackTrace();
        if (logger.isDebugEnabled()) {
            logger.debug(method, ex);
        }
    }

    private static class ExceptionTranslator {
        public static Object translate(Throwable ex, Class returnType) {
            IErrorCode rc = CommonResultCode.DEFAULT_INTERNAL_ERROR;
            //String args = ex.getMessage();

            if (ex instanceof DataAccessException) {
                rc = CommonResultCode.ERROR_DB;
            } else if (ex instanceof BusinessException) {
                return ResultFactory.createResult(CommonResultCode.BIZ_ERROR, returnType, ex.getMessage());
            }

            return ResultFactory.createResult(rc, returnType);
        }
    }

    private static class ResultFactory {
        static Object createResult(IErrorCode rc, Class returnType, Object... args) {
            BaseResult result = null;
            if (PlainResult.class.equals(returnType)) {
                result = new PlainResult();
            } else if (ListResult.class.equals(returnType)) {
                result = new ListResult();
            } else if(BaseResult.class.equals(returnType)){
                result = new BaseResult();
            }else{
            	//如果返回值不是返回值不是BaseResult自己或父类，返回null
            	return null;
            }

            result.setErrorMessage(rc, args);
            return result;
        }
    }
}
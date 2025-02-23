import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";

export const GetCurrentLabId = createParamDecorator(
    (data: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest()
        console.log(request)
        if (!request.user) {
            console.warn('Lab object is undefined in GetCurrentLabId decorator.');
            throw new ForbiddenException('Invalid Lab Login')
          }
      
        return request.user['sub'];
    },
);